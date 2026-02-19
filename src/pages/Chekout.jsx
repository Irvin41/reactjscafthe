import React, { useState, useContext, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { formatPrice } from "../utils/formatters";
import "../styles/Paiement.css";
import "../styles/Contact.css";
import { Link } from "react-router-dom";

const Paiement = () => {
  const { cart, cartTotal } = useCart();
  const { user } = useContext(AuthContext);

  // États pour la gestion de l'édition locale
  const [editing, setEditing] = useState(false);
  const [hasModified, setHasModified] = useState(false);
  const [profilCommande, setProfilCommande] = useState({});
  const [formData, setFormData] = useState({});

  // États pour les choix de livraison et paiement
  const [modeLivraison, setModeLivraison] = useState("retrait");
  const [modePaiement, setModePaiement] = useState("CARTE");

  // Sécurité sur l'ID client
  const idClient = user?.id_client || user?.id;
  const API = import.meta.env.VITE_API_URL;

  // Récupération des données client
  useEffect(() => {
    // Si l'utilisateur n'est pas encore chargé dans le context, on attend.
    if (!idClient) {
      console.log("Paiement: En attente de l'ID utilisateur...");
      return;
    }

    console.log("Paiement: Récupération des données pour l'ID", idClient);

    fetch(`${API}/api/client/${idClient}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok)
          throw new Error("Erreur lors de la récupération du profil");
        return res.json();
      })
      .then((data) => {
        // Log de diagnostic : Vérifie ici si les clés (nom, prenom, etc.)
        // correspondent à celles de ta base de données
        console.log("Données reçues de l'API :", data);

        const initialData = data.client || data || {};

        // On initialise les deux états avec les données reçues
        setProfilCommande(initialData);
        setFormData(initialData);
      })
      .catch((err) => {
        console.error("Erreur API Paiement:", err);
      });
  }, [idClient, API]);

  // Calcul financier
  const calculFinancier = cart.reduce(
    (acc, item) => {
      const tauxTVA = parseFloat(item.taux_tva) || 5.5;
      const prixHTUnitaire = parseFloat(item.prix_ht) || 0;
      const quantite = parseInt(item.quantity) || 0;
      const montantTVAUnitaire = (prixHTUnitaire * tauxTVA) / 100;

      if (tauxTVA === 20) {
        acc.tva20 += montantTVAUnitaire * quantite;
      } else {
        acc.tva55 += montantTVAUnitaire * quantite;
      }
      return acc;
    },
    { tva55: 0, tva20: 0 },
  );

  const handleSaveLocal = () => {
    setProfilCommande(formData);
    setEditing(false);
    setHasModified(true);
  };

  const handleCancelLocal = () => {
    setFormData(profilCommande);
    setEditing(false);
  };

  const handleChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (!hasModified) setHasModified(true);
  };

  const SEUIL_GRATUIT = 45;
  const obtenirFrais = () => {
    if (modeLivraison === "retrait" || cartTotal >= SEUIL_GRATUIT) return 0;
    const frais = { chronopost: 12.9, colissimo: 8.9, mondial: 4.9 };
    return frais[modeLivraison] || 0;
  };

  const fraisPort = obtenirFrais();
  const totalFinal = cartTotal + fraisPort;

  return (
    <main className="page etroit">
      <h1 className="titre centre">Votre commande</h1>

      {/* SECTION 1 : PANIER */}
      <section className="auth-card section-paiement">
        <h2 className="sous-titre">VOTRE PANIER</h2>
        <div className="corps-panier">
          {cart.map((item) => (
            <div key={item.id} className="panier-item">
              <span className="discret">
                {item.quantity}x {item.name || item.nom}
              </span>
              <span className="item-prix">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}

          <div className="recap-details">
            {calculFinancier.tva55 > 0 && (
              <div className="recap-final-tva">
                <span>TVA (5.5%) </span>
                <span>{formatPrice(calculFinancier.tva55)}</span>
              </div>
            )}
            {calculFinancier.tva20 > 0 && (
              <div className="recap-final-tva">
                <span>TVA (20%) </span>
                <span>{formatPrice(calculFinancier.tva20)}</span>
              </div>
            )}
            <div className="total-final centre">
              <span>Total : </span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <p className="message-info-livraison centre">
              Livraison gratuite à partir de {formatPrice(SEUIL_GRATUIT)}.
            </p>
          </div>
          <div className="centre action-retour">
            <Link to="/shop" className="lien centre">
              Continuer vos achats
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 : COORDONNÉES */}
      <section className="auth-card section-paiement">
        <div className="entete-adresse">
          <h2 className="sous-titre">COORDONNÉES</h2>
          {!editing ? (
            <button
              type="button"
              className="lien"
              onClick={() => setEditing(true)}
            >
              MODIFIER
            </button>
          ) : (
            <div className="boutons-edition">
              <button
                type="button"
                className="lien dore"
                onClick={handleSaveLocal}
              >
                ENREGISTRER
              </button>
              <button
                type="button"
                className="lien annuler"
                onClick={handleCancelLocal}
              >
                ANNULER
              </button>
            </div>
          )}
        </div>

        <div className="auth-form une-colonne">
          <div className="grille-choix-adresse">
            <input
              readOnly={!editing}
              value={formData.prenom || ""}
              placeholder="Prénom"
              onChange={(e) => handleChange("prenom", e.target.value)}
            />
            <input
              readOnly={!editing}
              value={formData.nom || ""}
              placeholder="Nom"
              onChange={(e) => handleChange("nom", e.target.value)}
            />
          </div>
          <input
            readOnly={!editing}
            value={formData.adresse || ""}
            placeholder="Adresse (Rue)"
            onChange={(e) => handleChange("adresse", e.target.value)}
          />
          <div className="grille-choix-adresse">
            <input
              readOnly={!editing}
              value={formData.code_postal || ""}
              placeholder="Code Postal"
              onChange={(e) => handleChange("code_postal", e.target.value)}
            />
            <input
              readOnly={!editing}
              value={formData.ville || ""}
              placeholder="Ville"
              onChange={(e) => handleChange("ville", e.target.value)}
            />
          </div>
          {(editing || hasModified) && (
            <div className="checkbox-container">
              <input type="checkbox" id="privacy" required />
              <label htmlFor="privacy" className="auth-switch">
                J'accepte que mes données soient utilisées pour le traitement de
                ma demande conformément à la politique de confidentialité.
              </label>
              <p className="message-info-livraison">
                * Modifications uniquement pour cette commande.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3 : LIVRAISON & PAIEMENT */}
      <section className="auth-card section-paiement">
        <h2 className="sous-titre">LIVRAISON & PAIEMENT</h2>
        <div className="grille-choix-paiement">
          <div className="colonne-choix">
            <h3 className="titre-choix">Paiement</h3>
            {["Paiement au comptoir", "Carte Bancaire", "Paypal"].map(
              (mode) => (
                <button
                  key={mode}
                  className={`bouton-choix ${modePaiement === mode ? "actif" : ""}`}
                  onClick={() => setModePaiement(mode)}
                >
                  <strong>{mode}</strong>
                </button>
              ),
            )}
          </div>

          <div className="colonne-choix">
            <h3 className="titre-choix">Livraison</h3>
            <button
              className={`bouton-choix ${modeLivraison === "chronopost" ? "actif" : ""}`}
              onClick={() => setModeLivraison("chronopost")}
            >
              <div className="info-transport">
                <strong>Chronopost</strong>
                <small>24-48h</small>
              </div>
              <span>12.90€</span>
            </button>
            <button
              className={`bouton-choix ${modeLivraison === "colissimo" ? "actif" : ""}`}
              onClick={() => setModeLivraison("colissimo")}
            >
              <div className="info-transport">
                <strong>Colissimo</strong>
                <small>3-5 jours</small>
              </div>
              <span>8.90€</span>
            </button>
            <button
              className={`bouton-choix ${modeLivraison === "mondial" ? "actif" : ""}`}
              onClick={() => setModeLivraison("mondial")}
            >
              <div className="info-transport">
                <strong>Mondial Relay</strong>
                <small>48-72h</small>
              </div>
              <span>4.90€</span>
            </button>
            <button
              className={`bouton-choix ${modeLivraison === "retrait" ? "actif" : ""}`}
              onClick={() => setModeLivraison("retrait")}
            >
              <div className="info-transport">
                <strong>Retrait magasin</strong>
                <small>24h</small>
              </div>
              <span>GRATUIT</span>
            </button>
          </div>
        </div>

        <div className="zone-validation">
          <div className="recap-final-ligne">
            <span>Total panier </span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="recap-final-ligne">
            <span>Frais de port</span>
            <span>{fraisPort === 0 ? "OFFERT" : formatPrice(fraisPort)}</span>
          </div>
          <div className="total-final">
            Total avec frais : {formatPrice(totalFinal)}
          </div>
          <button className="bouton bouton-principal large">
            PAYER MA COMMANDE
          </button>
        </div>
      </section>
    </main>
  );
};

export default Paiement;
