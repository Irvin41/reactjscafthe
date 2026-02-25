import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Orders.css";

const API = import.meta.env.VITE_API_URL;

const statusClass = (statut = "") => {
  const s = statut.toUpperCase();
  if (s.includes("LIVRE")) return "status-delivered";
  if (s.includes("EXPED")) return "status-shipping";
  if (s.includes("PREPAR")) return "status-prepared";
  if (s.includes("VALID")) return "status-validated";
  if (s.includes("ATTENTE")) return "status-pending";
  return "";
};

const statusLabel = (statut = "") => {
  const s = statut.toUpperCase();
  if (s.includes("LIVRE")) return "Livré";
  if (s.includes("EXPED")) return "Expédié";
  if (s.includes("PREPAR")) return "En préparation";
  if (s.includes("VALID")) return "Validée";
  if (s.includes("ATTENTE")) return "En attente";
  return statut;
};

// Commande "en cours" = tout sauf livré et annulé
const isEnCours = (statut = "") => {
  const s = statut.toUpperCase();
  return !s.includes("LIVRE") && !s.includes("ANNUL");
};

const Orders = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const id = user?.id_client || user?.id;

  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("TOUTES");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API}/api/commandes/client/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const data = d.commandes || d;
        console.log("Premier article :", data[0]?.articles[0]);
        setCommandes(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const filtrees =
    filter === "EN COURS"
      ? commandes.filter((c) => isEnCours(c.statut))
      : filter === "LIVREES"
        ? commandes.filter((c) => c.statut?.toUpperCase().includes("LIVRE"))
        : commandes;

  const countEnCours = commandes.filter((c) => isEnCours(c.statut)).length;
  const countLivrees = commandes.filter((c) =>
    c.statut?.toUpperCase().includes("LIVRE"),
  ).length;

  if (authLoading || !user)
    return (
      <main className="orders-page">
        <div className="orders-loading">Chargement…</div>
      </main>
    );

  return (
    <main className="orders-page">
      {/* ── Header ── */}
      <div className="orders-page-header">
        <div>
          <h1>MES COMMANDES</h1>
          <p>
            {commandes.length} commande{commandes.length !== 1 ? "s" : ""} au
            total
          </p>
        </div>
        <Link to="/profile" className="lien">
          Retour au profil
        </Link>
      </div>

      {/* ── Carte principale ── */}
      <div className="orders-main-card">
        {/* ── Filtres ── */}
        <div className="orders-page-filters">
          {[
            { key: "TOUTES", count: commandes.length },
            { key: "EN COURS", count: countEnCours },
            { key: "LIVREES", count: countLivrees },
          ].map(({ key, count }) => (
            <button
              key={key}
              type="button"
              className={filter === key ? "is-active" : ""}
              onClick={() => setFilter(key)}
            >
              {key}
              <span className="filter-count">{count}</span>
            </button>
          ))}
        </div>

        {/* ── Liste ── */}
        {loading ? (
          <div className="orders-loading">Chargement des commandes…</div>
        ) : filtrees.length === 0 ? (
          <div className="orders-empty">
            <p>Aucune commande dans cette catégorie</p>
          </div>
        ) : (
          <div className="orders-full-list">
            {filtrees.map((order) => {
              const isOpen = expanded === order.id_commande;
              return (
                <article
                  key={order.id_commande}
                  className={`order-full-item ${isOpen ? "is-open" : ""}`}
                >
                  {/* ── Ligne principale ── */}
                  <div
                    className="order-full-head"
                    onClick={() =>
                      setExpanded(isOpen ? null : order.id_commande)
                    }
                  >
                    <div className="order-full-ref">
                      <span className="order-full-date">
                        {new Date(order.date_commande).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </span>
                      <strong className="order-ref">
                        ORD-{String(order.id_commande).padStart(6, "0")}
                      </strong>
                    </div>

                    {/* Miniatures dans la ligne — max 3 */}
                    {order.articles?.length > 0 && (
                      <div className="order-head-thumbs">
                        {order.articles.slice(0, 3).map((a, i) =>
                          a.image ? (
                            <img
                              key={i}
                              src={`${API}/images/${a.image}`}
                              alt={a.nom_article}
                              className="order-thumb"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div
                              key={i}
                              className="order-thumb order-thumb--placeholder"
                            >
                              <span>{a.nom_article?.[0] ?? "?"}</span>
                            </div>
                          ),
                        )}
                        {order.articles.length > 4 && (
                          <div className="order-thumb order-thumb--more">
                            +{order.articles.length - 4}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="order-full-meta">
                      <span
                        className={`order-status-badge ${statusClass(order.statut)}`}
                      >
                        {statusLabel(order.statut)}
                      </span>
                      <span className="order-full-total">
                        {Number(order.total_ttc || 0)
                          .toFixed(2)
                          .replace(".", ",")}{" "}
                        €
                      </span>
                      <span
                        className={`order-chevron ${isOpen ? "is-open" : ""}`}
                      >
                        ›
                      </span>
                    </div>
                  </div>

                  {/* ── Détail accordéon ── */}
                  {isOpen && (
                    <div className="order-full-detail">
                      <div className="order-detail-grid">
                        {/* Articles avec miniatures */}
                        <div className="order-detail-articles">
                          <h4>ARTICLES</h4>
                          {order.articles?.length > 0 ? (
                            <ul>
                              {order.articles.map((a, i) => (
                                <li key={i}>
                                  {/* Miniature 75×75 */}
                                  <div className="article-thumb-wrap">
                                    {a.image ? (
                                      <img
                                        src={`${API}/images/${a.image}`}
                                        alt={a.nom_article}
                                        className="article-thumb"
                                        onError={(e) => {
                                          e.target.parentNode.innerHTML = `<div class="article-thumb article-thumb--placeholder"><span>${a.nom_article?.[0] ?? "?"}</span></div>`;
                                        }}
                                      />
                                    ) : (
                                      <div className="article-thumb article-thumb--placeholder">
                                        <span>{a.nom_article?.[0] ?? "?"}</span>
                                        <span>{a.poids ?? "?"}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="article-desc">
                                    <span className="article-name">
                                      {a.nom_article}
                                    </span>
                                    <span className="article-name">
                                      {a.poids}
                                    </span>
                                    <div>
                                      {a.quantite > 1 && (
                                        <span className="article-qty">
                                          ×{a.quantite}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="orders-empty-small">
                              Détail non disponible
                            </p>
                          )}
                        </div>

                        {/* Récap */}
                        <div className="order-detail-recap">
                          <h4>RÉCAPITULATIF</h4>
                          <div className="recap-row">
                            <span>Référence</span>
                            <strong>
                              ORD-{String(order.id_commande).padStart(6, "0")}
                            </strong>
                          </div>
                          <div className="recap-row">
                            <span>Date</span>
                            <strong>
                              {new Date(order.date_commande).toLocaleDateString(
                                "fr-FR",
                              )}
                            </strong>
                          </div>
                          <div className="recap-row">
                            <span>Statut</span>
                            <strong className={statusClass(order.statut)}>
                              {statusLabel(order.statut)}
                            </strong>
                          </div>
                          <div className="recap-row recap-total">
                            <span>Total</span>
                            <strong>
                              {Number(order.total_ttc || 0)
                                .toFixed(2)
                                .replace(".", ",")}{" "}
                              €
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;
