import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import "../styles/Profile.css";
import "../styles/Orders.css";

const API = import.meta.env.VITE_API_URL;

const paliers = [
  {
    name: "Bronze",
    points: "0-300 PTS",
    perks: ["-5% sur les accessoires"],
    min: 0,
    max: 300,
  },
  {
    name: "Argent",
    points: "301-500 PTS",
    perks: [
      "-5% sur les accessoires",
      "Livraison gratuite en point relais",
      "Échantillons offerts",
    ],
    min: 301,
    max: 500,
  },
  {
    name: "Or",
    points: "501+ PTS",
    perks: [
      "Échantillons offerts",
      "-15% sur tout le site",
      "Livraison Gratuite",
    ],
    min: 501,
    max: Infinity,
  },
];

const getIndexPalier = (pts) =>
  paliers.findIndex((t) => pts >= t.min && pts <= t.max);

const classeStatut = (statut = "") => {
  const s = statut.toUpperCase();
  if (s.includes("LIVRE")) return "statut-livre";
  if (s.includes("EXPED")) return "statut-expedition";
  if (s.includes("PREPAREE")) return "statut-prepare";
  if (s.includes("ATTENTE") || s.includes("PREPARATION"))
    return "statut-attente";
  return "";
};

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

/* ── Icône œil ouvert ── */
const IconeOeil = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/* ── Icône œil barré ── */
const IconeOeilBarre = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/* ── Champ mot de passe avec œil + indicateur rouge/vert ── */
const ChampPassword = ({
  label,
  field,
  editing,
  formData,
  onChange,
  placeholder = "",
  compareField = null,
}) => {
  const [visible, setVisible] = useState(false);

  const valeur = formData?.[field] ?? "";
  const valeurCompare = compareField ? (formData?.[compareField] ?? "") : null;

  /* couleur uniquement si on compare (champ "confirmer") et qu'il y a une saisie */
  const match =
    compareField !== null && valeur.length > 0
      ? valeur === valeurCompare
      : null;

  const couleurBord =
    match === true ? "#4caf50" : match === false ? "#e53935" : undefined;

  return (
    <label>
      {label}
      <div style={{ position: "relative" }}>
        <input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={valeur}
          readOnly={!editing}
          onChange={(e) => onChange(field, e.target.value)}
          style={{
            paddingRight: "2.4rem",
            ...(couleurBord && {
              borderColor: couleurBord,
              boxShadow: `0 0 0 1px ${couleurBord}`,
              transition: "border-color 0.2s, box-shadow 0.2s",
            }),
          }}
        />
        {editing && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            aria-label={
              visible ? "Masquer le mot de passe" : "Afficher le mot de passe"
            }
            className="btn-oeil"
          >
            {visible ? <IconeOeilBarre /> : <IconeOeil />}
          </button>
        )}
      </div>

      {/* Message indicateur sous le champ "confirmer" */}
      {match !== null && valeur.length > 0 && (
        <span
          className={`indicateur-mdp ${match ? "indicateur-mdp--ok" : "indicateur-mdp--err"}`}
        >
          {match
            ? "✓ Les mots de passe correspondent"
            : "✗ Les mots de passe sont différents"}
        </span>
      )}
    </label>
  );
};

const Champ = ({
  label,
  field,
  type = "text",
  editing,
  formData,
  onChange,
  forceReadOnly = false,
  placeholder = "exemple",
}) => (
  <label>
    {label}
    <input
      type={type}
      placeholder={placeholder}
      value={formData?.[field] ?? ""}
      readOnly={!editing || forceReadOnly}
      className={forceReadOnly ? "input-verrouille" : ""}
      onChange={(e) => onChange(field, e.target.value)}
    />
  </label>
);

const Profile = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const id = user?.id_client || user?.id;

  const refProfil = useRef(null);
  const refCommandes = useRef(null);
  const refFidelite = useRef(null);

  const [profil, setProfil] = useState(null);
  const [commandes, setCommandes] = useState([]);
  const [loadingProfil, setLoadingProfil] = useState(false);

  const [editInfos, setEditInfos] = useState(false);
  const [editPass, setEditPass] = useState(false);
  const [checkPass, setCheckPass] = useState(false);
  const [checkPassError, setCheckPassError] = useState(null);
  const [editAddr, setEditAddr] = useState(false);
  const [editAddr_fact, setEditAddr_fact] = useState(false);

  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const scrollVers = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderOnglets = (currentLabel) => (
    <div className="profil-onglets">
      <span
        onClick={() => scrollVers(refProfil)}
        className={currentLabel === "MON PROFIL" ? "actif" : ""}
      >
        MON PROFIL
      </span>
      <span
        onClick={() => scrollVers(refCommandes)}
        className={currentLabel === "MES COMMANDES" ? "actif" : ""}
      >
        MES COMMANDES
      </span>
      <span
        onClick={() => scrollVers(refFidelite)}
        className={currentLabel === "PROGRAMME FIDELITE" ? "actif" : ""}
      >
        PROGRAMME FIDELITE
      </span>
    </div>
  );

  const verifierAncienMdp = async () => {
    setCheckPassError(null);
    try {
      const res = await fetch(`${API}/api/client/check-password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mot_de_passe_actuel: formData.mot_de_passe_actuel,
        }),
      });
      if (!res.ok) throw new Error("Mot de passe incorrect.");
      setCheckPass(true);
    } catch (err) {
      setCheckPassError(err.message);
    }
  };

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
  }, [id, API]);

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/api/commandes/client/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const data = d.commandes || d;
        setCommandes(Array.isArray(data) ? data : []);
      })
      .catch(console.error);
  }, [id, API]);

  const handleSave = async (sectionSetter) => {
    if (
      formData.mot_de_passe &&
      formData.mot_de_passe !== formData.mot_de_passe_confirm
    ) {
      setSaveError("Les mots de passe ne correspondent pas.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    const { email, mot_de_passe_confirm, ...dataToSend } = formData;
    try {
      const res = await fetch(`${API}/api/client/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
      setProfil({ ...formData, mot_de_passe: "", mot_de_passe_confirm: "" });
      sectionSetter(false);
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (sectionSetter) => {
    setFormData({ ...profil });
    sectionSetter(false);
    setSaveError(null);
    setCheckPass(false);
    setCheckPassError(null);
  };

  const handleChange = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const points = profil?.points_fidelite ?? 0;
  const indexPalier = getIndexPalier(points);
  const palierSuivant = paliers[indexPalier + 1];

  if (authLoading || loadingProfil)
    return <div className="profil-chargement">Chargement...</div>;
  if (!user)
    return <div className="profil-chargement">Veuillez vous connecter.</div>;

  return (
    <main className="page-profil">
      <div className="profil-entete">
        <h1>Bonjour, {profil?.prenom || user?.prenom}.</h1>
        <p aria-label="date-d-inscription">
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

      {/* SECTION 1 : MON PROFIL */}
      <section className="carte-profil" ref={refProfil}>
        {renderOnglets("MON PROFIL")}
        <div className="profil-grille">
          <div className="profil-principal">
            {saveOk && (
              <div className="profil-alerte profil-alerte--ok">
                ✓ Profil mis à jour
              </div>
            )}
            {saveError && (
              <div className="profil-alerte profil-alerte--err">
                ✗ {saveError}
              </div>
            )}

            {/* Informations personnelles */}
            <article className="profil-section">
              <div className="ligne-titre">
                <h2 className="sous-titre">INFORMATIONS PERSONNELLES</h2>
                {!editInfos ? (
                  <button type="button" onClick={() => setEditInfos(true)}>
                    MODIFIER
                  </button>
                ) : (
                  <div className="boutons-edition">
                    <button
                      type="button"
                      onClick={() => handleSave(setEditInfos)}
                      disabled={saving}
                    >
                      {saving ? "..." : "ENREGISTRER"}
                    </button>
                    <button
                      type="button"
                      className="annuler"
                      onClick={() => handleCancel(setEditInfos)}
                    >
                      ANNULER
                    </button>
                  </div>
                )}
              </div>
              <div className="grille-champs deux-colonnes">
                <Champ
                  label="PRÉNOM"
                  field="prenom"
                  editing={editInfos}
                  formData={formData}
                  onChange={handleChange}
                  placeholder="prénom"
                />
                <Champ
                  label="NOM"
                  field="nom"
                  editing={editInfos}
                  formData={formData}
                  onChange={handleChange}
                  placeholder="nom"
                />
                <Champ
                  label="EMAIL"
                  field="email"
                  type="email"
                  forceReadOnly={true}
                  editing={editInfos}
                  formData={formData}
                  onChange={handleChange}
                />
                <Champ
                  label="TÉLÉPHONE"
                  field="telephone"
                  type="tel"
                  editing={editInfos}
                  formData={formData}
                  onChange={handleChange}
                  placeholder="01 23 45 67 89"
                />
              </div>
            </article>

            {/* Mot de passe */}
            <article className="profil-section">
              <div className="ligne-titre">
                <h2 className="sous-titre">MOT DE PASSE</h2>
                {!editPass ? (
                  <button type="button" onClick={() => setEditPass(true)}>
                    MODIFIER
                  </button>
                ) : (
                  <div className="boutons-edition">
                    <button
                      type="button"
                      onClick={() => handleSave(setEditPass)}
                      disabled={saving}
                    >
                      {saving ? "..." : "ENREGISTRER"}
                    </button>
                    <button
                      type="button"
                      className="annuler"
                      onClick={() => handleCancel(setEditPass)}
                    >
                      ANNULER
                    </button>
                  </div>
                )}
              </div>
              <div className="grille-champs trois-colonnes">
                <ChampPassword
                  label="ANCIEN MOT DE PASSE"
                  field="mot_de_passe_actuel"
                  placeholder="votre mot de passe"
                  editing={editPass}
                  formData={formData}
                  onChange={handleChange}
                />
                <Champ
                  label="NOUVEAU MOT DE PASSE"
                  field="mot_de_passe"
                  placeholder="nouveau mot de passe"
                  editing={editPass}
                  formData={formData}
                  onChange={handleChange}
                />
                <Champ
                  label="CONFIRMER"
                  field="mot_de_passe_confirm"
                  placeholder="confirmer nouveau mot de passe"
                  editing={editPass}
                  formData={formData}
                  onChange={handleChange}
                  compareField="mot_de_passe"
                />
              </div>
            </article>

            {/* Adresse de livraison */}
            <article className="profil-section">
              <div className="ligne-titre">
                <h2 className="sous-titre">ADRESSE DE LIVRAISON</h2>
                {!editAddr ? (
                  <button type="button" onClick={() => setEditAddr(true)}>
                    MODIFIER
                  </button>
                ) : (
                  <div className="boutons-edition">
                    <button
                      type="button"
                      onClick={() => handleSave(setEditAddr)}
                      disabled={saving}
                    >
                      {saving ? "..." : "ENREGISTRER"}
                    </button>
                    <button
                      type="button"
                      className="annuler"
                      onClick={() => handleCancel(setEditAddr)}
                    >
                      ANNULER
                    </button>
                  </div>
                )}
              </div>
              <div className="grille-champs">
                <Champ
                  label="RUE"
                  field="adresse"
                  editing={editAddr}
                  formData={formData}
                  onChange={handleChange}
                  placeholder="rue"
                />
                <div className="grille-champs deux-colonnes">
                  <Champ
                    label="CODE POSTAL"
                    field="code_postal"
                    editing={editAddr}
                    formData={formData}
                    onChange={handleChange}
                    placeholder="code postal"
                  />
                  <Champ
                    label="VILLE"
                    field="ville"
                    editing={editAddr}
                    formData={formData}
                    onChange={handleChange}
                    placeholder="ville"
                  />
                </div>
              </div>
              {/* Adresse de facturation */}
              <article className="profil-section">
                <div className="ligne-titre">
                  <h2 className="sous-titre">ADRESSE DE FACTURATION</h2>
                  {!editAddr_fact ? (
                    <button
                      type="button"
                      onClick={() => setEditAddr_fact(true)}
                    >
                      MODIFIER
                    </button>
                  ) : (
                    <div className="boutons-edition">
                      <button
                        type="button"
                        onClick={() => handleSave(setEditAddr_fact)}
                        disabled={saving}
                      >
                        {saving ? "..." : "ENREGISTRER"}
                      </button>
                      <button
                        type="button"
                        className="annuler"
                        onClick={() => handleCancel(setEditAddr_fact)}
                      >
                        ANNULER
                      </button>
                    </div>
                  )}
                </div>
              </article>
              <div className="grille-champs">
                <Champ
                  label="RUE"
                  field="adresse_facturation"
                  editing={editAddr_fact}
                  formData={formData}
                  onChange={handleChange}
                  placeholder="rue"
                />
                <div className="grille-champs deux-colonnes">
                  <Champ
                    label="CODE POSTAL"
                    field="code_postal_facturation"
                    editing={editAddr_fact}
                    formData={formData}
                    onChange={handleChange}
                    placeholder="code postal"
                  />
                  <Champ
                    label="VILLE"
                    field="ville_facturation"
                    editing={editAddr_fact}
                    formData={formData}
                    onChange={handleChange}
                    placeholder="ville"
                  />
                </div>
              </div>
            </article>
          </div>

          {/* Carte fidélité mini */}
          <aside className="profil-lateral">
            <article
              className={`carte-fidelite-mini palier-${paliers[indexPalier]?.name.toLowerCase()}`}
            >
              <p>POINTS FIDÉLITÉ</p>
              <p className="n-fidelite">N° {profil?.numero_fidelite ?? "—"}</p>
              <h2 className="point-fidelite">{points} points</h2>
              <p className="mini-palier">
                {palierSuivant
                  ? `Plus que ${palierSuivant.min - points} points avant le niveau ${palierSuivant.name}`
                  : `Vous êtes au niveau ${paliers[indexPalier].name}`}
              </p>
            </article>
          </aside>
        </div>
      </section>

      {/* SECTION 2 : MES COMMANDES */}
      <section className="carte-profil" ref={refCommandes}>
        {renderOnglets("MES COMMANDES")}
        <div className="ligne-titre">
          <h2 className="profil-titre-section sous-titre">MES COMMANDES</h2>
          <Link to="/commandes" className="lien">
            Historique complet →
          </Link>
        </div>
        {commandes.length === 0 ? (
          <p className="profil-vide">Aucune commande pour l'instant</p>
        ) : (
          <div className="orders-full-list">
            {commandes.slice(0, 3).map((order) => {
              const isOpen = expanded === order.id_commande;
              return (
                <article
                  key={order.id_commande}
                  className={`order-full-item ${isOpen ? "is-open" : ""}`}
                >
                  {/* ── Ligne cliquable ── */}
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

                    {/* Miniatures — max 3 */}
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
                        {order.articles.length > 3 && (
                          <div className="order-thumb order-thumb--more">
                            +{order.articles.length - 3}
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
                        {Number(order.total_ttc || order.TOTAL || 0)
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

                  {/* ── Accordéon détail ── */}
                  {isOpen && (
                    <div className="order-full-detail">
                      <div className="order-detail-grid">
                        {/* Articles */}
                        <div className="order-detail-articles">
                          <h4>ARTICLES</h4>
                          {order.articles?.length > 0 ? (
                            <ul>
                              {order.articles.map((a, i) => (
                                <li key={i}>
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
                              {Number(order.total_ttc || order.TOTAL || 0)
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
      </section>

      {/* SECTION 3 : PROGRAMME FIDÉLITÉ */}
      <section className="carte-profil" ref={refFidelite}>
        {renderOnglets("PROGRAMME FIDELITE")}
        <h2 className="profil-titre-section sous-titre">PROGRAMME FIDÉLITÉ</h2>

        <div className="grille-paliers">
          {paliers.map((palier, i) => (
            <article
              key={palier.name}
              className={`palier palier-${palier.name.toLowerCase()} ${
                i === indexPalier ? "actif" : ""
              }`}
            >
              {i === indexPalier && (
                <span className="palier-badge">VOTRE NIVEAU</span>
              )}
              <h3>{palier.name}</h3>
              <p>{palier.points}</p>
              <ul>
                {palier.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Profile;
