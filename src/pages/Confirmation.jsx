import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import "../styles/Confirmation.css";
import { useCart } from "../context/CartContext.jsx";

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const { clearCart } = useCart();
  const API = import.meta.env.VITE_API_URL; // ✅ corrigé
  const location = useLocation();
  const state = location.state;

  // ── Mode retrait boutique → affichage direct sans Stripe
  if (state?.mode === "comptoir") {
    return (
      <div className="confirmation-page">
        <div className="confirmation-card">
          <div className="confirmation-icon confirmation-icon--succes">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <h2 className="confirmation-titre">Commande confirmée !</h2>
          <p className="confirmation-sous-titre">
            Rendez-vous en boutique pour récupérer vos articles et régler au
            comptoir.
          </p>

          <div className="confirmation-recap">
            <div className="confirmation-recap-ligne">
              <span className="confirmation-recap-label">N° de commande</span>
              <span className="confirmation-recap-value">
                ORD-{String(state.commande.id_commande).padStart(6, "0")}
              </span>
            </div>
            <div className="confirmation-recap-ligne">
              <span className="confirmation-recap-label">Total à régler</span>
              <span className="confirmation-recap-value vert">
                {Number(state.commande.total_ttc || 0)
                  .toFixed(2)
                  .replace(".", ",")}{" "}
                €
              </span>
            </div>
            <div className="confirmation-recap-ligne">
              <span className="confirmation-recap-label">Paiement</span>
              <span className="confirmation-recap-value">Au comptoir</span>
            </div>
          </div>

          {state.articles?.length > 0 && (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                marginBottom: "1.5rem",
                textAlign: "left",
              }}
            >
              {state.articles.map((a, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.3rem 0",
                    borderBottom: "1px solid var(--color-border, #eee)",
                  }}
                >
                  <span>
                    {a.nom_article}
                    {a.poids ? ` — ${a.poids}` : ""}
                  </span>
                  {a.quantite > 1 && <span>×{a.quantite}</span>}
                </li>
              ))}
            </ul>
          )}

          <Link
            to="/commandes"
            className="bouton bouton-secondaire confirmation-btn"
          >
            Voir ma commande
          </Link>
          <Link to="/" className="bouton bouton-tertiaire confirmation-btn">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  // ── Mode Stripe (carte bancaire)
  useEffect(() => {
    const paymentIntent = searchParams.get("payment_intent");
    const redirectStatus = searchParams.get("redirect_status");

    if (redirectStatus !== "succeeded") {
      setErreur("Le paiement a échoué ou a été annulé.");
      setLoading(false);
      return;
    }

    fetch(
      `${API}/api/commandes/confirmation?payment_intent=${paymentIntent}&redirect_status=${redirectStatus}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setCommande(data.commande);
        clearCart();
        setLoading(false);
      })
      .catch(() => {
        setErreur("Erreur lors de la récupération de la commande.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="confirmation-page">
        <div className="confirmation-card">
          <p className="centre discret">Chargement...</p>
        </div>
      </div>
    );

  if (erreur)
    return (
      <div className="confirmation-page">
        <div className="confirmation-card">
          <div className="confirmation-icon confirmation-icon--erreur">✕</div>
          <h2 className="confirmation-titre">Paiement échoué</h2>
          <p className="confirmation-sous-titre">{erreur}</p>
          <Link
            to="/paiement"
            className="bouton bouton-principal confirmation-btn"
          >
            Réessayer
          </Link>
        </div>
      </div>
    );

  const numeroCommande = `#${new Date().getFullYear()}-${String(commande.id_commande).padStart(5, "0")}`;
  const montant = parseFloat(
    commande.MONTANT_TOTAL_PAYE || commande.total_ttc || 0,
  ).toFixed(2);

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="confirmation-icon confirmation-icon--succes">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h2 className="confirmation-titre">Commande validée !</h2>
        <p className="confirmation-sous-titre">
          Merci pour votre confiance. Votre commande est en route.
        </p>

        <div className="confirmation-recap">
          <div className="confirmation-recap-ligne">
            <span className="confirmation-recap-label">N° de commande</span>
            <span className="confirmation-recap-value">{numeroCommande}</span>
          </div>
          <div className="confirmation-recap-ligne">
            <span className="confirmation-recap-label">Total payé</span>
            <span className="confirmation-recap-value vert">{montant} €</span>
          </div>
          <div className="confirmation-recap-ligne">
            <span className="confirmation-recap-label">Livraison estimée</span>
            <span className="confirmation-recap-value">3-5 jours</span>
          </div>
        </div>

        <Link
          to="/commandes"
          className="bouton bouton-secondaire confirmation-btn"
        >
          Voir ma commande
        </Link>
        <Link to="/" className="bouton bouton-tertiaire confirmation-btn">
          Retour à l'accueil
        </Link>

        <p className="confirmation-email discret">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ marginRight: "6px", verticalAlign: "middle" }}
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 7l10 7 10-7" />
          </svg>
          Email de confirmation envoyé
        </p>
      </div>
    </div>
  );
};

export default Confirmation;
