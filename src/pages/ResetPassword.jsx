import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return setMessage("Les mots de passe divergent.");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/client/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, mot_de_passe: newPassword }),
      },
    );

    if (res.ok) {
      alert("Mot de passe mis à jour !");
      navigate("/login");
    } else {
      setMessage("Lien invalide ou expiré.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-single">
        <h2>Nouveau mot de passe</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmer"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {message && <div className="error-message">{message}</div>}
          <button type="submit" className="auth-button">
            Valider
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
