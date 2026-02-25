import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Contact.css";

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
  id,
  value,
  onChange,
  placeholder = "",
  compareValue = null,
}) => {
  const [visible, setVisible] = useState(false);

  const match =
    compareValue !== null && value.length > 0 ? value === compareValue : null;

  const couleurBord =
    match === true ? "#4caf50" : match === false ? "#e53935" : undefined;

  return (
    <>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          style={{
            width: "100%",
            paddingRight: "2.4rem",
            ...(couleurBord && {
              borderColor: couleurBord,
              boxShadow: `0 0 0 1px ${couleurBord}`,
              transition: "border-color 0.2s, box-shadow 0.2s",
            }),
          }}
        />
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
      </div>

      {match !== null && value.length > 0 && (
        <span
          className={`indicateur-mdp ${match ? "indicateur-mdp--ok" : "indicateur-mdp--err"}`}
        >
          {match
            ? "✓ Les mots de passe correspondent"
            : "✗ Les mots de passe sont différents"}
        </span>
      )}
    </>
  );
};

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [motDePasse2, setMotDePasse2] = useState("");
  const [motDePasse3, setMotDePasse3] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.revealRegister) {
      setShowRegister(true);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/client/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, mot_de_passe: motDePasse }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Erreur de connexion");
        return;
      }

      login(data.client);
      navigate("/profile");
    } catch (error) {
      console.error("Erreur lors de la connexion: ", error);
      setErrorMsg("Une erreur s'est produite lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (motDePasse2 !== motDePasse3) {
      setErrorMsg("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (!registerEmail || !motDePasse2) {
      setErrorMsg("Tous les champs sont requis");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/client/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: registerEmail,
            mot_de_passe: motDePasse2,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Erreur lors de la création du compte");
        return;
      }

      login(data.client);
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de l'inscription: ", error);
      setErrorMsg("Une erreur s'est produite lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/client/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) {
        setErrorMsg("Erreur lors de l'envoi du mail de récupération.");
        return;
      }

      setSuccessMsg(
        "Si cet email existe, un lien de réinitialisation a été envoyé.",
      );
    } catch (error) {
      setErrorMsg("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div
        className={`auth-card auth-card-single ${showRegister ? "inscription" : ""}`}
      >
        {/* ── Connexion / Mot de passe oublié ── */}
        <section className="auth-panel auth-connexion">
          {showForgot ? (
            <>
              <h2>Récupération</h2>
              <p className="auth-subtitle">
                Saisissez votre email pour recevoir un lien de réinitialisation.
              </p>
              <form onSubmit={handleForgotSubmit} className="auth-form">
                <label className="sr-only" htmlFor="forgotEmail">
                  Email
                </label>
                <input
                  id="forgotEmail"
                  type="email"
                  value={email}
                  required
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />

                {errorMsg && <div className="error-message">{errorMsg}</div>}
                {successMsg && (
                  <div
                    className="success-message"
                    style={{
                      color: "green",
                      fontSize: "0.9rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {successMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? "Envoi..." : "Envoyer le lien"}
                </button>
              </form>
              <p className="auth-switch">
                <button
                  type="button"
                  className="lien"
                  onClick={() => {
                    setErrorMsg("");
                    setSuccessMsg("");
                    setShowForgot(false);
                  }}
                >
                  Retour à la connexion
                </button>
              </p>
            </>
          ) : (
            <>
              <h2>Déjà client</h2>
              <form onSubmit={handleSubmit} className="auth-form">
                <label className="sr-only" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  required
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label className="sr-only" htmlFor="password">
                  Mot de passe
                </label>
                <ChampPassword
                  id="password"
                  value={motDePasse}
                  placeholder="Mot de passe"
                  onChange={(e) => setMotDePasse(e.target.value)}
                />

                <div>
                  <button
                    type="button"
                    className="lien"
                    onClick={() => {
                      setErrorMsg("");
                      setShowForgot(true);
                    }}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                {errorMsg && !showRegister && (
                  <div className="error-message">{errorMsg}</div>
                )}

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? "Connexion..." : "Connexion"}
                </button>
              </form>
              <p className="auth-switch">
                Si vous n'avez pas de compte,{" "}
                <button
                  type="button"
                  className="lien"
                  onClick={() => {
                    setErrorMsg("");
                    setShowRegister(true);
                  }}
                >
                  inscrivez-vous
                </button>
                .
              </p>
            </>
          )}
        </section>

        {/* ── Inscription ── */}
        <section id="inscription" className="auth-panel auth-inscription">
          <h2>Nouveau client</h2>
          <p className="auth-subtitle">
            Créez un compte pour suivre vos commandes et profiter d'offres
            exclusives.
          </p>
          <form onSubmit={handleCreate} className="auth-form">
            <label className="sr-only" htmlFor="registerEmail">
              Email
            </label>
            <input
              id="registerEmail"
              type="email"
              value={registerEmail}
              placeholder="Email"
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />

            <label className="sr-only" htmlFor="registerPassword">
              Mot de passe
            </label>
            <ChampPassword
              id="registerPassword"
              value={motDePasse2}
              placeholder="Mot de passe"
              onChange={(e) => setMotDePasse2(e.target.value)}
            />

            <label className="sr-only" htmlFor="registerPassword2">
              Confirmer
            </label>
            <ChampPassword
              id="registerPassword2"
              value={motDePasse3}
              placeholder="Confirmer votre mot de passe"
              onChange={(e) => setMotDePasse3(e.target.value)}
              compareValue={motDePasse2}
            />

            {errorMsg && showRegister && (
              <div className="error-message">{errorMsg}</div>
            )}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Création du compte..." : "Inscription"}
            </button>
            <div className="checkbox-container">
              <input type="checkbox" id="privacy" required />
              <label htmlFor="privacy" className="auth-switch">
                J'accepte que mes données soient utilisées pour le traitement de
                ma demande conformément à la politique de confidentialité.
              </label>
            </div>
          </form>
          <p className="auth-switch">
            Déjà un compte ?{" "}
            <button
              type="button"
              className="lien"
              onClick={() => {
                setErrorMsg("");
                setShowRegister(false);
              }}
            >
              connectez-vous
            </button>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
