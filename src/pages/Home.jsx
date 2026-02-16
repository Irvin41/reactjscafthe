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
    <div className="home-wrapper">
      {/* --- SECTION HERO --- */}
      <section className="hero-container">
        <div className="hero-content">
          <img src={logo} alt="CAF'THÉ" className="hero-logo-img" />
          <h1 className="hero-title">L'ESSENCE DU THÉ ET DU CAFÉ</h1>
          <p className="hero-description">
            Découvrez notre sélection exclusive de thés et cafés sourcés
            directement auprès des producteurs.
          </p>
          <div className="hero-search">
            <input
              type="search"
              className="hero-search-input"
              placeholder="Rechercher un thé, un café, un accessoire..."
              aria-label="Rechercher des produits"
            />
            <button className="btn-gold-explorer" type="button">
              Rechercher
            </button>
          </div>
        </div>
        <picture className="hero-image-side">
          <img
            src={heroBox}
            alt="Box avec des fleurs"
            className="main-shadow-img"
          />
        </picture>
      </section>
      {/* --- SECTION PRODUITS : INCONTOURNABLES --- */}
      <section className="section-padding">
        <div className="section-header-flex">
          <h2 className="section-title">Nos Incontournables</h2>
          <Link to="/shop" className="link-view-all">
            VOIR TOUT
          </Link>
        </div>
        <p className="section-subtitle">
          Les produits préférés de notre communauté.
        </p>

        <BestSellers />
      </section>
      {/* --- SECTION FIDÉLITÉ --- */}
      <section className="loyalty-full-width">
        <div className="loyalty-inner">
          <h2 className="loyalty-eyebrow">✦ VOTRE FIDÉLITÉ SE SAVOURE ✦</h2>{" "}
          <h3 className="loyalty-title">
            Parce que chaque tasse compte, rejoignez le Cercle Cafthé.
          </h3>
          <div className="loyalty-perk">
            <strong>100 points</strong>
            <span> offerts à l'inscription</span>
          </div>
          <div className="loyalty-perk">
            <strong>1 point</strong>
            <span> par euro dépensé</span>
          </div>
          <div className="loyalty-perk">
            <p> Inscrivez vous pour découvrir notre programme </p>
          </div>
        </div>
        <button
          className="btn-dark-green"
          onClick={() => (user ? navigate("/profile") : navigate("/login"))}
        >
          INSCRIPTION
        </button>
      </section>

      <section className="section-padding">
        <div className="section-header-flex">
          <h2 className="section-title">Vos Favoris</h2>
          <span className="link-view-all">Vos commandes</span>
        </div>
        <p className="section-subtitle">
          Les produits que vous commandez le plus souvent.
        </p>

        <FavoriteProducts />
      </section>
    </div>
  );
};

export default Home;
