import React from "react";
import "../styles/Home.css";
import logo from "../assets/logo.png";
import heroBox from "../assets/box-cafthe.png";
import coffretDecouverte from "../assets/image/coffret/coffret-découverte-café.png";
import filtreClassique from "../assets/image/café/moulu-filtre.png";
import decafeineSuisse from "../assets/image/café/decafeine.png";

const bestSellers = [
  {
    id: "coffret-decouverte",
    badge: "Découverte",
    badgeClass: "badge-color",
    category: "COFFRETS",
    origin: "Monde",
    name: "Coffret Découverte",
    desc: "Assortiment 5 cafés du monde 5×50g.",
    price: "45,00 €",
    image: coffretDecouverte,
  },
  {
    id: "filtre-classique",
    badge: "MOULU",
    badgeClass: "badge-color",
    category: "CAFÉS MOULUS",
    origin: "Amérique Centrale",
    name: "Filtre Classique",
    desc: "Mouture moyenne pour cafetière filtre - 250g.",
    price: "14,00 €",
    image: filtreClassique,
  },
  {
    id: "decafeine-suisse",
    badge: "GRAINS",
    badgeClass: "badge-color",
    category: "CAFÉS EN GRAINS",
    origin: "Suisse",
    name: "Décaféiné Suisse",
    desc: "Café décaféiné doux, méthode à l'eau - 250g.",
    price: "19,00 €",
    image: decafeineSuisse,
  },
];

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

        <div className="products-layout-grid">
          {bestSellers.map((product) => (
            <article className="product-item-card" key={product.id}>
              <div className="product-image-wrap">
                <div className={`badge ${product.badgeClass}`}>
                  {product.badge}
                </div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                  loading="lazy"
                />
              </div>
              <div className="product-body">
                <span className="prod-meta">
                  {product.category} • {product.origin}
                </span>
                <h3 className="prod-name">{product.name}</h3>
                <p className="prod-desc-short">{product.desc}</p>
                <div className="prod-footer-row">
                  <span className="prod-price">{product.price}</span>
                  <button className="round-add-btn" type="button">
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* --- SECTION FIDÉLITÉ --- */}
      <section className="loyalty-full-width">
        <h2 className="loyalty-title">VOTRE FIDÉLITÉ SE SAVOURE !</h2>
        <div className="loyalty-inner">
          <p>Parce que chaque tasse compte, rejoignez le Cercle Cafthé.</p>
          <p>100 points offerts à l'inscription</p>
          <p>1 point à chaque euro dépensé</p>
          <p className="promo-free">Gratuit Sans engagement</p>
          <button className="btn-dark-green">INSCRIPTION</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
