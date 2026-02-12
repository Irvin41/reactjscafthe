import React from "react";
import "../styles/Home.css";
import logo from "../assets/logo.png";
import heroBox from "../assets/box-cafthe.png";
import BestSellers from "../components/BestSellers.jsx";
import FavoriteProducts from "../components/FavoriteProducts.jsx";

const Home = () => {
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
            <button className="hero-search-btn" type="button">
              Rechercher
            </button>
          </div>
          <button className="btn-gold-explorer">EXPLORER LA COLLECTION</button>
        </div>
        <div className="hero-image-side">
          <img
            src={heroBox}
            alt="Box avec des fleurs"
            className="main-shadow-img"
          />
        </div>
      </section>
      {/* --- SECTION PRODUITS : INCONTOURNABLES --- */}
      <section className="section-padding">
        <div className="section-header-flex">
          <h2 className="section-title">Nos Incontournables</h2>
          <span className="link-view-all">VOIR TOUT</span>
        </div>
        <p className="section-subtitle">
          Les produits préférés de notre communauté.
        </p>

        <BestSellers />
      </section>
      {/* --- SECTION FIDÉLITÉ --- */}
      <section className="loyalty-full-width">
        <h2 className="loyalty-title">VOTRE FIDÉLITÉ SE SAVOURE !</h2>
        <div className="loyalty-inner">
          <p>Parce que chaque tasse compte, rejoignez le Cercle Cafthé.</p>
          <p>100 points offerts à l'inscription</p>
          <p>1 point à chaque euro dépensé</p>
          <p className="promo-free">Inscription gratuite et sans engagement</p>
          <button className="btn-dark-green">INSCRIPTION</button>
        </div>
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
