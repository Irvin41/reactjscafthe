import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import "../styles/Profile.css";

const API = import.meta.env.VITE_API_URL;

const paliers = [
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

const Champ = ({
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
  const id = user?.id_client || user?.id;

  const [activeTab, setActiveTab] = useState("MON PROFIL");

  const refProfil = useRef(null);
  const refCommandes = useRef(null);
  const refFidelite = useRef(null);

  const ONGLETS = [
    { label: "MON PROFIL", ref: refProfil },
    { label: "MES COMMANDES", ref: refCommandes },
    { label: "PROGRAMME FIDELITE", ref: refFidelite },
  ];

  const scrollVers = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  const renderOnglets = () => (
    <div className="profil-onglets profil-onglets--fixe">
      {ONGLETS.map((t) => (
        <span
          key={t.label}
          onClick={() => scrollVers(t.ref)}
          className={activeTab === t.label ? "actif" : ""}
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
  const indexPalier = getIndexPalier(points);
  const palierSuivant = paliers[indexPalier + 1];

  if (authLoading)
    return (
      <main className="page-profil">
        <div className="profil-chargement">Chargement…</div>
      </main>
    );
  if (!user)
    return (
      <main className="page-profil">
        <div className="profil-chargement">
          Vous devez être connecté pour accéder à votre profil.
        </div>
      </main>
    );
  if (loadingProfil)
    return (
      <main className="page-profil">
        <div className="profil-chargement">Chargement du profil…</div>
      </main>
    );

  return (
    <main className="page-profil">
      {/* ════════ SECTION 1 : MON PROFIL ════════ */}
      <section className="carte-profil" ref={refProfil}>
        {renderOnglets()}
        <div className="profil-entete">
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

            <article className="profil-section">
              <div className="ligne-titre">
                <h2>INFORMATIONS PERSONNELLES</h2>
                {!editing ? (
                  <button type="button" onClick={() => setEditing(true)}>
                    MODIFIER
                  </button>
                ) : (
                  <div className="boutons-edition">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? "…" : "ENREGISTRER"}
                    </button>
                    <button
                      type="bouton-cancel"
                      className="annuler"
                      onClick={handleCancel}
                    >
                      ANNULER
                    </button>
                  </div>
                )}
              </div>
              <div className="grille-champs deux-colonnes">
                <Champ label="PRÉNOM" field="prenom" {...fieldProps} />
                <Champ label="NOM" field="nom" {...fieldProps} />
                <Champ
                  label="EMAIL"
                  field="email"
                  type="email"
                  {...fieldProps}
                />
                <Champ
                  label="TÉLÉPHONE"
                  field="telephone"
                  type="tel"
                  {...fieldProps}
                />
              </div>
            </article>

            <article className="profil-section">
              <div className="ligne-titre">
                <h2>MOT DE PASSE</h2>
                {!editing && (
                  <button type="button" onClick={() => setEditing(true)}>
                    MODIFIER
                  </button>
                )}
              </div>
              <div className="grille-champs deux-colonnes">
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

            <article className="profil-section">
              <div className="ligne-titre">
                <h2>ADRESSE DE LIVRAISON</h2>
                {!editing && (
                  <button type="button" onClick={() => setEditing(true)}>
                    MODIFIER
                  </button>
                )}
              </div>
              <div className="grille-champs">
                <Champ label="RUE" field="adresse" {...fieldProps} />
                <div className="grille-champs deux-colonnes">
                  <Champ
                    label="CODE POSTAL"
                    field="code_postal"
                    {...fieldProps}
                  />
                  <Champ label="VILLE" field="ville" {...fieldProps} />
                </div>
              </div>
            </article>
          </div>

          <aside className="profil-lateral">
            <article className="carte-fidelite-mini">
              <p>POINTS FIDÉLITÉ</p>
              <p style={{ fontSize: "0.68rem", opacity: 0.8, marginTop: 4 }}>
                N° {profil?.numero_fidelite ?? "—"}
              </p>
              <strong>{points}</strong>
              <small>
                {palierSuivant
                  ? `Plus que ${palierSuivant.min - points} pts avant le niveau ${palierSuivant.name}`
                  : "Vous êtes au niveau maximum 🏆"}
              </small>
            </article>
          </aside>
        </div>
      </section>

      {/* ════════ SECTION 2 : MES COMMANDES ════════ */}
      <section className="carte-profil" ref={refCommandes}>
        {renderOnglets()}
        <div className="ligne-titre" style={{ marginBottom: "24px" }}>
          <h2 className="profil-titre-section">MES COMMANDES</h2>
          <Link to="/commandes" className="lien">
            Historique complet →
          </Link>
        </div>

        {loadingCommandes ? (
          <p className="profil-vide">Chargement des commandes…</p>
        ) : commandesApercu.length === 0 ? (
          <p className="profil-vide">Aucune commande pour l'instant</p>
        ) : (
          <div className="liste-commandes">
            {commandesApercu.map((order) => (
              <Link
                key={order.id_commande}
                to="/commandes"
                className="commande-item commande-item--cliquable"
              >
                <div className="commande-entete">
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
                  <div className="commande-meta">
                    <p>
                      STATUT{" "}
                      <span className={classeStatut(order.statut)}>
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
                    <span className="commande-fleche">›</span>
                  </div>
                </div>
                {order.articles?.length > 0 && (
                  <div className="commande-produits">
                    {order.articles.map((a, i) => (
                      <span key={i}>
                        {a.nom_article}
                        {a.quantite > 1 ? ` ×${a.quantite}` : ""}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ════════ SECTION 3 : PROGRAMME FIDÉLITÉ ════════ */}
      <section className="carte-profil" ref={refFidelite}>
        {renderOnglets()}
        <h2 className="profil-titre-section" style={{ marginBottom: "24px" }}>
          PROGRAMME FIDÉLITÉ
        </h2>
        <div className="grille-paliers">
          {paliers.map((palier, i) => (
            <article
              key={palier.name}
              className={`palier palier-${palier.name.toLowerCase()} ${i === indexPalier ? "actif" : ""}`}
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
