import React from "react";
import { Link } from "react-router-dom";
import "../styles/site-map.css";

const MapSite = () => {
  return (
    <main>
      <header>
        <div className="site-map-titre">
          <h1 className="titre">Plan du site</h1>
        </div>
      </header>

      <article className="site-map" aria-label="Plan du site">
        <section className="site-map-card" aria-labelledby="nav-section">
          <h2 id="nav-section" className="sous-titre">
            Navigation
          </h2>
          <ul>
            <li>
              <Link className="lien" to="/" role="link">
                Accueil
              </Link>
            </li>
            <li>
              <Link className="lien" to="/cafes" role="link">
                Cafés
              </Link>
            </li>
            <li>
              <Link className="lien" to="/thes" role="link">
                Thés
              </Link>
            </li>
            <li>
              <Link className="lien" to="/accessoires" role="link">
                Accessoires
              </Link>
            </li>
            <li>
              <Link className="lien" to="/coffrets" role="link">
                Coffrets
              </Link>
            </li>
            <li>
              <Link className="lien" to="/shop" role="link">
                Boutique
              </Link>
            </li>
          </ul>
        </section>

        <section className="site-map-card" aria-labelledby="account-section">
          <h2 id="account-section" className="sous-titre">
            Mon compte
          </h2>
          <ul>
            <li>
              <Link className="lien" to="/login" role="link">
                Connexion
              </Link>
            </li>
            <li>
              <Link className="lien" to="/profile" role="link">
                Mon profil
              </Link>
            </li>
            <li>
              <Link className="lien" to="/commandes" role="link">
                Mes commandes
              </Link>
            </li>
            <li>
              <Link className="lien" to="/reset-password" role="link">
                Réinitialiser le mot de passe
              </Link>
            </li>
          </ul>
        </section>

        <section className="site-map-card" aria-labelledby="order-section">
          <h2 id="order-section" className="sous-titre">
            Commande
          </h2>
          <ul>
            <li>
              <Link className="lien" to="/paiement" role="link">
                Paiement
              </Link>
            </li>
            <li>
              <Link className="lien" to="/confirmation" role="link">
                Confirmation de commande
              </Link>
            </li>
            <li>
              <Link className="lien" to="/livraison" role="link">
                Livraison
              </Link>
            </li>
            <li>
              <Link className="lien" to="/retour" role="link">
                Retours
              </Link>
            </li>
          </ul>
        </section>

        <section className="site-map-card" aria-labelledby="info-section">
          <h2 id="info-section" className="sous-titre">
            Informations
          </h2>
          <ul>
            <li>
              <Link className="lien" to="/a-propos" role="link">
                À propos
              </Link>
            </li>
            <li>
              <Link className="lien" to="/contact" role="link">
                Contact
              </Link>
            </li>
            <li>
              <Link className="lien" to="/cgv" role="link">
                Conditions générales de vente
              </Link>
            </li>
            <li>
              <Link className="lien" to="/mentions-legales" role="link">
                Mentions légales
              </Link>
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
};

export default MapSite;
