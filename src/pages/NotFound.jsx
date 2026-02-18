import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="page centre aere">
      <section>
        <header>
          <span className="gros-chiffre">404</span>
          <h1 className="titre">Page Introuvable</h1>
        </header>

        <p className="texte centre discret etroit">
          L'adresse que vous tentez de consulter n'est plus disponible ou a été
          déplacée. Nous vous invitons à poursuivre votre expérience au sein de
          notre maison en retournant vers nos collections d'exception.
        </p>
        <nav>
          <Link
            title="Retour à l'accueil"
            to="/"
            className="bouton bouton-secondaire"
          >
            RETOUR À LA BOUTIQUE
          </Link>
        </nav>
      </section>
    </main>
  );
};

export default NotFound;
