import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [motDePasse2, setMotDePasse2] = useState("");
  const [motDePasse3, setMotDePasse3] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);

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
          body: JSON.stringify({
            email,
            mot_de_passe: motDePasse,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Erreur de connexion");
        return;
      }
      const { client } = data;
      // Appel au login via le contexte
      login(client);
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

    // Validation des mots de passe
    if (motDePasse2 !== motDePasse3) {
      setErrorMsg("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    // Validation des champs requis
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

      // Connexion automatique après inscription réussie
      login(data.client);
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de l'inscription: ", error);
      setErrorMsg("Une erreur s'est produite lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-single">
        {!showRegister ? (
          <section className="auth-panel auth-login">
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

              {errorMsg && <div className="error-message">{errorMsg}</div>}

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? "Connexion..." : "Connexion"}
              </button>
            </form>
            <p className="auth-switch">
              Si vous n'avez pas de compte,{" "}
              <button
                type="button"
                className="auth-link"
                onClick={() => setShowRegister(true)}
              >
                inscrivez-vous
              </button>
              .
            </p>
          </section>
        ) : (
          <section id="inscription" className="auth-panel auth-register">
            <h2>Nouveau client</h2>
            <p className="auth-subtitle">
              Créez un compte pour suivre vos commandes et profiter d'offres
              exclusives.
            </p>
            <form onSubmit={handleCreate} className="auth-form">
              <label className="sr-only" htmlFor="firstName">
                Prénom
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                placeholder="Prénom"
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <label className="sr-only" htmlFor="lastName">
                Nom
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                placeholder="Nom"
                onChange={(e) => setLastName(e.target.value)}
                required
              />

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
                Confirmer mot de passe
              </label>
              <input
                id="registerPassword2"
                type="password"
                value={motDePasse3}
                placeholder="Confirmer votre mot de passe"
                onChange={(e) => setMotDePasse3(e.target.value)}
                required
              />

              {errorMsg && <div className="error-message">{errorMsg}</div>}

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? "Création du compte..." : "Inscription"}
              </button>
            </form>
            <p className="auth-switch">
              Déjà un compte ?{" "}
              <button
                type="button"
                className="auth-link"
                onClick={() => setShowRegister(false)}
              >
                connectez-vous
              </button>
              .
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default Login;
