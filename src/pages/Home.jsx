import React, { useContext } from "react";
import "../styles/Home.css";
import logo from "../assets/logo.png";
import heroBox from "../assets/box-cafthe.png";
import BestSellers from "../components/BestSellers.jsx";
import FavoriteProducts from "../components/FavoriteProducts.jsx";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="accueil">
      {/* --- HERO --- */}
      <section className="hero contenu">
        <div className="hero-contenu">
          <img src={logo} alt="CAF'THÉ" className="hero-logo" />
          <h1 className="titre">L'ESSENCE DU THÉ ET DU CAFÉ</h1>
          <p className="texte discret">
            Découvrez notre sélection exclusive de thés et cafés sourcés
            directement auprès des producteurs.
          </p>
        </div>
        <picture className="hero-image">
          <img
            src={heroBox}
            alt="Box avec des fleurs"
            className="image-ombre"
          />
        </picture>
      </section>

      {/* --- INCONTOURNABLES --- */}
      <section className="zone-produits contenu">
        <div className="entete-section">
          <h2 className="titre">Nos Incontournables</h2>
          <Link to="/shop" className="lien">
            Voir tout les produits
          </Link>
        </div>
        <p className="texte discret">
          Les produits préférés de notre communauté.
        </p>
        <BestSellers />
      </section>

      {/* --- FIDÉLITÉ --- */}
      <section className="contenu etroit centre">
        <div className="fidelite">
          <h2 className="dore fidelite-accroche">
            ✦ VOTRE FIDÉLITÉ SE SAVOURE ✦
          </h2>
          <h3 className="fidelite-titre">
            Parce que chaque tasse compte, rejoignez le Cercle Cafthé.
          </h3>
          <p>
            <strong>100 points</strong> offerts à l'inscription
          </p>
          <p>
            <strong>1 point</strong> par euro dépensé
          </p>
          <p>Inscrivez vous pour découvrir notre programme</p>
          <button
            className="bouton bouton-principal"
            onClick={() => navigate(user ? "/profile" : "/login")}
          >
            INSCRIPTION / CONNEXION
          </button>
        </div>
      </section>

      {/* --- FAVORIS --- */}
      <section className="zone-produits contenu">
        <div className="entete-section">
          <h2 className="titre">Vos Favoris</h2>
          <Link to="/profile" className="lien">
            Vos commandes
          </Link>
        </div>
        <p className="texte discret">
          Les produits que vous commandez le plus souvent.
        </p>
        <FavoriteProducts />
      </section>
    </div>
  );
};

export default Home;
