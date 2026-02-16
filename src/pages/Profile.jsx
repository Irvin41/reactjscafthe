import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const API = import.meta.env.VITE_API_URL;

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
  if (s.includes("PREPAREE")) return "status-prepared";
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

  const [activeTab, setActiveTab] = useState("MON PROFIL");

  const refProfil = useRef(null);
  const refCommandes = useRef(null);
  const refFidelite = useRef(null);

  const TABS = [
    { label: "MON PROFIL", ref: refProfil },
    { label: "MES COMMANDES", ref: refCommandes },
    { label: "PROGRAMME FIDELITE", ref: refFidelite },
  ];

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Détection de la section visible ──
  useEffect(() => {
    const sections = [
      { label: "MON PROFIL", el: refProfil.current },
      { label: "MES COMMANDES", el: refCommandes.current },
      { label: "PROGRAMME FIDELITE", el: refFidelite.current },
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = sections.find((s) => s.el === entry.target);
            if (section) setActiveTab(section.label);
          }
        });
      },
      { root: null, rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    sections.forEach(({ el }) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [refProfil.current, refCommandes.current, refFidelite.current]);

  const renderTabs = () => (
    <div className="profile-tabs profile-tabs--sticky">
      {TABS.map((t) => (
        <span
          key={t.label}
          onClick={() => scrollTo(t.ref)}
          className={activeTab === t.label ? "is-active" : ""}
        >
          {t.label}
        </span>
      ))}
    </div>
  );

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
      .then((d) => {
        const data = d.commandes || d;
        setCommandes(Array.isArray(data) ? data : []);
      })
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

  const listeCommandes = Array.isArray(commandes) ? commandes : [];
  const commandesApercu = listeCommandes.slice(0, 3);
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
      {/* ════════ SECTION 1 : MON PROFIL ════════ */}
      <section className="profile-card" ref={refProfil}>
        {renderTabs()}
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
                    placeholder={editing ? "Nouveau mot de passe" : "••••••••"}
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
          </div>

          <aside className="profile-side">
            <article className="loyalty-mini-card">
              <p>POINTS FIDÉLITÉ</p>
              <p style={{ fontSize: "0.68rem", opacity: 0.8, marginTop: 4 }}>
                N° {profil?.numero_fidelite ?? "—"}
              </p>
              <strong>{points}</strong>
              <small>
                {nextTier
                  ? `Plus que ${nextTier.min - points} pts avant le niveau ${nextTier.name}`
                  : "Vous êtes au niveau maximum 🏆"}
              </small>
            </article>
          </aside>
        </div>
      </section>

      {/* ════════ SECTION 2 : MES COMMANDES ════════ */}
      <section className="profile-card" ref={refCommandes}>
        {renderTabs()}
        <div className="section-title-row" style={{ marginBottom: "24px" }}>
          <h2 className="profile-section-heading">MES COMMANDES</h2>
          <button
            type="button"
            className="btn-voir-tout"
            onClick={() => navigate("/commandes")}
          >
            HISTORIQUE COMPLET →
          </button>
        </div>

        {loadingCommandes ? (
          <p className="profile-empty">Chargement des commandes…</p>
        ) : commandesApercu.length === 0 ? (
          <p className="profile-empty">Aucune commande pour l'instant</p>
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
      </section>

      {/* ════════ SECTION 3 : PROGRAMME FIDÉLITÉ ════════ */}
      <section className="profile-card" ref={refFidelite}>
        {renderTabs()}
        <h2
          className="profile-section-heading"
          style={{ marginBottom: "24px" }}
        >
          PROGRAMME FIDÉLITÉ
        </h2>
        <div className="tiers-grid">
          {tiers.map((tier, i) => (
            <article
              key={tier.name}
              /* On ajoute une classe basée sur le nom : tier-bronze, tier-argent, tier-or */
              className={`tier-item tier-${tier.name.toLowerCase()} ${i === tierIndex ? "is-active" : ""}`}
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
      </section>
    </main>
  );
};

export default Profile;
