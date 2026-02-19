import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Contact.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [motDePasse2, setMotDePasse2] = useState("");
  const [motDePasse3, setMotDePasse3] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // Pour confirmer l'envoi du mail
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false); // État pour la vue "Mot de passe oublié"
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
      navigate("/");
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

    if (!firstName || !lastName || !registerEmail || !motDePasse2) {
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
            prenom: firstName,
            nom: lastName,
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

  // Nouvelle fonction pour gérer l'envoi du mail de récupération
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
          body: JSON.stringify({ email }), // Utilise l'email saisi dans le champ de login
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
            /* VUE : RÉCUPÉRATION MOT DE PASSE */
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
            /* VUE : CONNEXION STANDARD */
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
                <input
                  id="password"
                  type="password"
                  value={motDePasse}
                  required
                  placeholder="Mot de passe"
                  onChange={(e) => setMotDePasse(e.target.value)}
                />

                {/* Lien mot de passe oublié */}
                <div
                  style={{
                    textAlign: "right",
                    marginTop: "-10px",
                    marginBottom: "15px",
                  }}
                >
                  <button
                    type="button"
                    className="lien"
                    style={{ fontSize: "0.85rem" }}
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
            <input
              id="registerPassword"
              type="password"
              value={motDePasse2}
              placeholder="Mot de passe"
              onChange={(e) => setMotDePasse2(e.target.value)}
              required
            />

            <label className="sr-only" htmlFor="registerPassword2">
              Confirmer
            </label>
            <input
              id="registerPassword2"
              type="password"
              value={motDePasse3}
              placeholder="Confirmer votre mot de passe"
              onChange={(e) => setMotDePasse3(e.target.value)}
              required
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
