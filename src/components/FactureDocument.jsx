import React from "react";
import "../styles/Facture.css";

function FactureDocument({ facture, lignes, logoBase64 }) {
  const numeroFormate = String(facture.NUMERO_FACTURE).padStart(6, "0");
  const remise = parseFloat(facture.remise_fidelite) || 0;
  const totalTTC = parseFloat(facture.MONTANT_TTC);
  const totalAvantRemise = totalTTC + remise;

  return (
    <div className="page">
      {/* Décorations */}
      <div className="deco-gauche" />
      <div className="deco-droite" />

      {/* En-tête */}
      <div className="header">
        <div>
          <picture>
            <img className="logo" src={logoBase64} alt="logo" />
          </picture>
        </div>
        <div className="titre-facture">FACTURE</div>
      </div>

      {/* Meta */}
      <div className="meta">
        <span>
          <strong>DATE :</strong>{" "}
          {new Date(facture.DATE_FACTURE).toLocaleDateString("fr-FR")}
        </span>
        <span>FACTURE N° : {numeroFormate}</span>
      </div>

      {/* Parties */}
      <div className="parties">
        <div className="partie">
          <h4>ÉMETTEUR :</h4>
          <p>
            CafThé
            <br />
            contact@cafthe.fr
            <br />
            123 Rue du Café
            <br />
            41000 Blois
          </p>
        </div>
        <div className="partie partie-droite">
          <h4>DESTINATAIRE :</h4>
          <p>
            {facture.PRENOM_CLIENT} {facture.NOM_CLIENT}
            <br />
            {facture.ADRESSE_FACTURATION}
            <br />
            {facture.CP_FACTURATION} {facture.VILLE_FACTURATION}
          </p>
        </div>
      </div>

      {/* Tableau des lignes */}
      <table className="facture-table">
        <thead>
          <tr>
            <td>Description :</td>
            <td>Prix Unitaire :</td>
            <td>Quantité :</td>
            <td>Poids :</td>
            <td>Total :</td>
          </tr>
        </thead>
        <tbody>
          {lignes.map((l, i) => (
            <tr key={i}>
              <td>{l.nom_article}</td>
              <td>{parseFloat(l.prix_ttc).toFixed(2)}€</td>
              <td>{l.quantite}</td>
              <td>{l.poids ?? "-"}</td>
              <td>{(parseFloat(l.prix_ttc) * l.quantite).toFixed(2)}€</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bas de page */}
      <div className="bas-page">
        <div className="reglement">
          <h4>RÈGLEMENT :</h4>
          <p>
            <strong>Mode :</strong> {facture.MODE_PAIEMENT}
            <br />
            Banque : CafThé Bank
            <br />
            Compte : FR76-XXXX-XXXX-XXXX
          </p>
        </div>
        <div className="totaux">
          <div className="ligne-total">
            <span>TOTAL HT :</span>
            <span>{parseFloat(facture.MONTANT_HT).toFixed(2)}€</span>
          </div>
          <div className="ligne-total">
            <span>TVA :</span>
            <span>{parseFloat(facture.MONTANT_TVA).toFixed(2)}€</span>
          </div>
          {remise > 0 && (
            <div className="ligne-total">
              <span>TOTAL AVANT REMISE :</span>
              <span>{totalAvantRemise.toFixed(2)}€</span>
            </div>
          )}
          <div className="ligne-total">
            <span>REMISE FIDÉLITÉ :</span>
            <span>{remise > 0 ? `− ${remise.toFixed(2)}€` : "-"}</span>
          </div>
          <div className="ligne-ttc">
            <span>TOTAL TTC :</span>
            <span>{totalTTC.toFixed(2)}€</span>
          </div>
        </div>
      </div>

      {/* Mentions légales */}
      <div className="mentions">
        <p>CGV consultables sur : www.cafthe.fr</p>
      </div>
    </div>
  );
}

export default FactureDocument;
