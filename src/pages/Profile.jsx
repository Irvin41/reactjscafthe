import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const API = import.meta.env.VITE_API_URL;

const TABS = ["MON PROFIL", "MES COMMANDES", "PROGRAMME FIDELITE"];

const tiers = [
  {
    name: "Bronze",
    points: "0-200 PTS",
    perks: ["-5% sur les accessoires"],
    min: 0,
    max: 200,
  },
  {
    name: "Argent",
    points: "201-600 PTS",
    perks: ["Livraison gratuite", "Échantillons offerts"],
    min: 201,
    max: 600,
  },
  {
    name: "Or",
    points: "601+ PTS",
    perks: ["-15% toute l'année", "Accès avant-premières"],
    min: 601,
    max: Infinity,
  },
];

const getCurrentTierIndex = (pts) =>
  tiers.findIndex((t) => pts >= t.min && pts <= t.max);

const statusClass = (statut = "") => {
  const s = statut.toUpperCase();
  if (s.includes("LIVRE")) return "status-delivered";
  if (s.includes("EXPED")) return "status-shipping";
  if (s.includes("ATTENTE") || s.includes("PREPARATION"))
    return "status-pending";
  return "";
};

const Field = ({
  label,
  field,
  type = "text",
  editing,
  formData,
  onChange,
}) => (
  <label>
    {label}
    <input
      type={type}
      value={formData?.[field] ?? ""}
      readOnly={!editing}
      onChange={(e) => onChange(field, e.target.value)}
    />
  </label>
);

const Profile = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const id = user?.id_client || user?.id;

  const [activeTab, setActiveTab] = useState(0);
  const [profil, setProfil] = useState(null);
  const [commandes, setCommandes] = useState([]);
  const [favoris, setFavoris] = useState([]);
  const [loadingProfil, setLoadingProfil] = useState(false);
  const [loadingCommandes, setLoadingCommandes] = useState(false);
  const [loadingFavoris, setLoadingFavoris] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [orderFilter, setOrderFilter] = useState("TOUTES");

  useEffect(() => {
    if (!id) return;
    setLoadingProfil(true);
    fetch(`${API}/api/client/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const c = d.client || d;
        setProfil(c);
        setFormData(c);
      })
      .catch(console.error)
      .finally(() => setLoadingProfil(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingCommandes(true);
    fetch(`${API}/api/commandes/client/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setCommandes(d.commandes || d || []))
      .catch(console.error)
      .finally(() => setLoadingCommandes(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingFavoris(true);
    fetch(`${API}/api/articles/favoris/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setFavoris(d.articles || d || []))
      .catch(console.error)
      .finally(() => setLoadingFavoris(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveOk(false);
    try {
      const res = await fetch(`${API}/api/client/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
      const data = await res.json();
      setProfil(data.client || formData);
      setEditing(false);
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profil });
    setEditing(false);
    setSaveError(null);
  };
  const handleChange = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));
  const fieldProps = { editing, formData, onChange: handleChange };

  const commandesFiltrees =
    orderFilter === "EN COURS"
      ? commandes.filter((c) =>
          ["EN_ATTENTE", "EN_PREPARATION", "EXPEDIE"].includes(c.statut),
        )
      : commandes;

  // Aperçu — 3 dernières commandes seulement
  const commandesApercu = commandesFiltrees.slice(0, 3);

  const points = profil?.points_fidelite ?? 0;
  const tierIndex = getCurrentTierIndex(points);
  const nextTier = tiers[tierIndex + 1];

  if (authLoading)
    return (
      <main className="profile-page">
        <div className="profile-loading">Chargement…</div>
      </main>
    );

  if (!user)
    return (
      <main className="profile-page">
        <div className="profile-loading">
          Vous devez être connecté pour accéder à votre profil.
        </div>
      </main>
    );

  if (loadingProfil)
    return (
      <main className="profile-page">
        <div className="profile-loading">Chargement du profil…</div>
      </main>
    );

  return (
    <main className="profile-page">
      <section className="profile-card">
        {/* ── Header ── */}
        <div className="profile-head">
          <div>
            <h1>Bonjour, {profil?.prenom || user?.prenom}.</h1>
            <p>
              MEMBRE DEPUIS{" "}
              {profil?.date_inscription
                ? new Date(profil.date_inscription)
                    .toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })
                    .toUpperCase()
                : "—"}
            </p>
          </div>
        </div>

        {/* ── Onglets ── */}
        <div className="profile-tabs">
          {TABS.map((t, i) => (
            <span
              key={t}
              className={activeTab === i ? "is-active" : ""}
              onClick={() => setActiveTab(i)}
            >
              {t}
            </span>
          ))}
        </div>

        {/* ════════ ONGLET 1 : MON PROFIL ════════ */}
        {activeTab === 0 && (
          <div className="profile-grid">
            <div className="profile-main">
              {saveOk && (
                <div className="profile-alert profile-alert--ok">
                  ✓ Profil mis à jour
                </div>
              )}
              {saveError && (
                <div className="profile-alert profile-alert--err">
                  ✗ {saveError}
                </div>
              )}

              {/* Infos perso */}
              <article className="profile-section">
                <div className="section-title-row">
                  <h2>INFORMATIONS PERSONNELLES</h2>
                  {!editing ? (
                    <button type="button" onClick={() => setEditing(true)}>
                      MODIFIER
                    </button>
                  ) : (
                    <div className="edit-btns">
                      <button
                        type="button"
                        className="btn-save"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? "…" : "ENREGISTRER"}
                      </button>
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={handleCancel}
                      >
                        ANNULER
                      </button>
                    </div>
                  )}
                </div>
                <div className="field-grid two-col">
                  <Field label="PRÉNOM" field="prenom" {...fieldProps} />
                  <Field label="NOM" field="nom" {...fieldProps} />
                  <Field
                    label="EMAIL"
                    field="email"
                    type="email"
                    {...fieldProps}
                  />
                  <Field
                    label="TÉLÉPHONE"
                    field="telephone"
                    type="tel"
                    {...fieldProps}
                  />
                </div>
              </article>

              {/* Mot de passe */}
              <article className="profile-section">
                <div className="section-title-row">
                  <h2>MOT DE PASSE</h2>
                  {!editing && (
                    <button type="button" onClick={() => setEditing(true)}>
                      MODIFIER
                    </button>
                  )}
                </div>
                <div className="field-grid two-col">
                  <label>
                    NOUVEAU MOT DE PASSE
                    <input
                      type="password"
                      placeholder={
                        editing ? "Nouveau mot de passe" : "••••••••"
                      }
                      readOnly={!editing}
                      onChange={(e) =>
                        handleChange("mot_de_passe", e.target.value)
                      }
                    />
                  </label>
                  <label>
                    CONFIRMER
                    <input
                      type="password"
                      placeholder={editing ? "Confirmer" : "••••••••"}
                      readOnly={!editing}
                      onChange={(e) =>
                        handleChange("mot_de_passe_confirm", e.target.value)
                      }
                    />
                  </label>
                </div>
              </article>

              {/* Adresse */}
              <article className="profile-section">
                <div className="section-title-row">
                  <h2>ADRESSE DE LIVRAISON</h2>
                  {!editing && (
                    <button type="button" onClick={() => setEditing(true)}>
                      MODIFIER
                    </button>
                  )}
                </div>
                <div className="field-grid">
                  <Field label="RUE" field="adresse" {...fieldProps} />
                  <div className="field-grid two-col">
                    <Field
                      label="CODE POSTAL"
                      field="code_postal"
                      {...fieldProps}
                    />
                    <Field label="VILLE" field="ville" {...fieldProps} />
                  </div>
                </div>
              </article>

              {/* Aperçu commandes — 3 dernières */}
              <article className="profile-section">
                <div className="section-title-row">
                  <h2>DERNIÈRES COMMANDES</h2>
                  <button type="button" onClick={() => navigate("/commandes")}>
                    VOIR TOUT →
                  </button>
                </div>
                {loadingCommandes ? (
                  <p className="profile-empty">Chargement…</p>
                ) : commandesApercu.length === 0 ? (
                  <p className="profile-empty">
                    Aucune commande pour l'instant
                  </p>
                ) : (
                  <div className="orders-list">
                    {commandesApercu.map((order) => (
                      <article
                        key={order.id_commande}
                        className="order-item order-item--clickable"
                        onClick={() => navigate("/commandes")}
                      >
                        <div className="order-head">
                          <div>
                            <p>
                              {new Date(order.date_commande).toLocaleDateString(
                                "fr-FR",
                              )}
                            </p>
                            <strong>
                              ORD-{String(order.id_commande).padStart(6, "0")}
                            </strong>
                          </div>
                          <div className="order-meta">
                            <p>
                              STATUT{" "}
                              <span className={statusClass(order.statut)}>
                                {order.statut}
                              </span>
                            </p>
                            <p>
                              TOTAL{" "}
                              <strong>
                                {Number(order.total_ttc || 0)
                                  .toFixed(2)
                                  .replace(".", ",")}{" "}
                                €
                              </strong>
                            </p>
                            <span className="order-arrow">›</span>
                          </div>
                        </div>
                        {order.articles?.length > 0 && (
                          <div className="order-products">
                            {order.articles.map((a, i) => (
                              <span key={i}>
                                {a.nom_article}
                                {a.quantite > 1 ? ` ×${a.quantite}` : ""}
                              </span>
                            ))}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </article>
            </div>

            {/* ── Sidebar ── */}
            <aside className="profile-side">
              <article className="loyalty-mini-card">
                <p>POINTS FIDÉLITÉ</p>
                <strong>{points}</strong>
                <small>
                  {nextTier
                    ? `Plus que ${nextTier.min - points} points avant le niveau ${nextTier.name} !`
                    : "Vous êtes au niveau maximum 🏆"}
                </small>
                <button type="button" onClick={() => setActiveTab(2)}>
                  VOIR MES AVANTAGES
                </button>
              </article>

              <article className="favorites-mini">
                <h4>MES FAVORIS</h4>
                {loadingFavoris ? (
                  <p className="profile-empty">Chargement…</p>
                ) : favoris.length === 0 ? (
                  <p className="profile-empty">Aucun favori pour l'instant</p>
                ) : (
                  <ul>
                    {favoris.slice(0, 4).map((f) => (
                      <li key={f.id_article}>{f.nom_article}</li>
                    ))}
                  </ul>
                )}
                <button type="button">EXPLORER LA COLLECTION</button>
              </article>
            </aside>
          </div>
        )}

        {/* ════════ ONGLET 2 : MES COMMANDES (aperçu + lien) ════════ */}
        {activeTab === 1 && (
          <>
            <div className="orders-header">
              <h2>DERNIÈRES COMMANDES</h2>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <div>
                  {["TOUTES", "EN COURS"].map((f) => (
                    <button
                      key={f}
                      type="button"
                      className={orderFilter === f ? "is-active" : ""}
                      onClick={() => setOrderFilter(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn-voir-tout"
                  onClick={() => navigate("/commandes")}
                >
                  HISTORIQUE COMPLET →
                </button>
              </div>
            </div>

            {loadingCommandes ? (
              <p className="profile-empty">Chargement des commandes…</p>
            ) : commandesFiltrees.length === 0 ? (
              <p className="profile-empty">Aucune commande trouvée</p>
            ) : (
              <div className="orders-list">
                {commandesApercu.map((order) => (
                  <article
                    key={order.id_commande}
                    className="order-item order-item--clickable"
                    onClick={() => navigate("/commandes")}
                  >
                    <div className="order-head">
                      <div>
                        <p>
                          {new Date(order.date_commande).toLocaleDateString(
                            "fr-FR",
                          )}
                        </p>
                        <strong>
                          ORD-{String(order.id_commande).padStart(6, "0")}
                        </strong>
                      </div>
                      <div className="order-meta">
                        <p>
                          STATUT{" "}
                          <span className={statusClass(order.statut)}>
                            {order.statut}
                          </span>
                        </p>
                        <p>
                          TOTAL{" "}
                          <strong>
                            {Number(order.total_ttc || 0)
                              .toFixed(2)
                              .replace(".", ",")}{" "}
                            €
                          </strong>
                        </p>
                        <span className="order-arrow">›</span>
                      </div>
                    </div>
                    {order.articles?.length > 0 && (
                      <div className="order-products">
                        {order.articles.map((a, i) => (
                          <span key={i}>
                            {a.nom_article}
                            {a.quantite > 1 ? ` ×${a.quantite}` : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
                {commandesFiltrees.length > 3 && (
                  <button
                    className="btn-voir-tout btn-voir-tout--block"
                    onClick={() => navigate("/commandes")}
                  >
                    Voir les {commandesFiltrees.length - 3} autres commandes →
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* ════════ ONGLET 3 : PROGRAMME FIDÉLITÉ ════════ */}
        {activeTab === 2 && (
          <div className="tiers-grid">
            {tiers.map((tier, i) => (
              <article
                key={tier.name}
                className={`tier-item ${i === tierIndex ? "is-active" : ""}`}
              >
                {i === tierIndex && (
                  <span className="tier-badge">VOTRE NIVEAU</span>
                )}
                <h3>{tier.name}</h3>
                <p>{tier.points}</p>
                <ul>
                  {tier.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;
