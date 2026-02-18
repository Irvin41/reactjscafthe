import React from "react";
import { Link } from "react-router-dom";
import "../styles/Contact.css";

const Retour = () => {
  return (
    <main className="page">
      <header>
        <h1 className="titre">Retours et Remboursements</h1>
        <p className="texte centre">
          Votre satisfaction est notre priorité. Si un produit ne vous convient
          pas, nous sommes là pour vous aider.
        </p>
      </header>

      <section className="bloc">
        <h2 className="sous-titre">Droit de Rétractation</h2>
        <p className="texte">
          Conformément à la loi, vous disposez d'un délai de{" "}
          <strong className="vert">14 jours</strong> après la réception de votre
          colis pour changer d'avis et nous retourner vos articles.
        </p>
      </section>

      <section className="bloc">
        <h2 className="sous-titre">Conditions de Retour</h2>
        <p className="texte">
          Pour être éligible à un retour, vos articles doivent respecter les
          critères suivants :
        </p>
        <ul>
          <li>
            <strong className="vert">
              Produits alimentaires (Café & Thé) :
            </strong>{" "}
            Pour des raisons de sécurité alimentaire, les paquets doivent être{" "}
            <strong className="vert">scellés</strong> et non ouverts.
          </li>
          <li>
            <strong className="vert">Accessoires :</strong> Les théières,
            moulins et balances doivent être retournés dans leur{" "}
            <strong className="vert">emballage d'origine</strong>, complets et
            sans trace d'utilisation.
          </li>
          <li>
            <strong className="vert">État général :</strong> Tout produit
            endommagé ou incomplet ne pourra faire l'objet d'un remboursement.
          </li>
        </ul>
      </section>

      <section className="bloc">
        <h2 className="sous-titre">Processus de Remboursement</h2>
        <p className="texte">
          Une fois votre retour réceptionné et inspecté par notre équipe :
        </p>
        <ul>
          <li>Nous vous envoyons un e-mail de confirmation.</li>
          <li>
            Le remboursement est effectué automatiquement sur votre{" "}
            <strong className="vert">mode de paiement initial</strong> (Carte
            Bancaire ou PayPal).
          </li>
          <li>
            Le délai de traitement est généralement de 7 à 10 jours ouvrés.
          </li>
        </ul>
      </section>

      <section className="bloc">
        <h2 className="sous-titre">Service Client</h2>
        <p className="texte">
          Pour toute question ou pour initier une procédure de retour, n'hésitez
          pas à nous contacter via{" "}
          <Link className="lien-contact" to="/contact">
            {" "}
            notre formulaire en ligne
          </Link>{" "}
          ou directement en boutique.
        </p>
      </section>
    </main>
  );
};

export default Retour;
