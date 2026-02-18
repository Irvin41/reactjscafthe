import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-cafthe.png";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div className="footer-brand">
          <Link
            to="#"
            className="logo"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img src={logo} alt="CAF'THÉ" />
          </Link>
          <p>
            L'excellence du the et du cafe premium, sourcee de maniere ethique
            et durable.
          </p>
        </div>

        <div className="footer-col">
          <h3>BOUTIQUE</h3>
          <ul>
            <li>
              <Link to="/thes">Thes</Link>
            </li>
            <li>
              <Link to="/cafes">Cafe</Link>
            </li>
            <li>
              <Link to="/accessoires">Accessoires</Link>
            </li>
            <li>
              <Link to="/coffret">Coffrets</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>INFORMATION</h3>
          <ul>
            <li>
              <Link to="/a-propos">A Propos</Link>
            </li>
            <li>
              <Link to="/livraison">Livraison</Link>
            </li>
            <li>
              <Link to="/retour">Retour</Link>
            </li>
            <li>
              <Link to="/contact"> Nous Contacter</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col footer-newsletter">
          <h3>NEWSLETTER</h3>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="footer-newsletter-form"
          >
            <input type="email" placeholder="Votre email" />
            <button type="submit" aria-label="Envoyer">
              →
            </button>
          </form>
        </div>
      </div>
      <p className="footer-bottom">
        © {new Date().getFullYear()} CAFTHE • ARTISANS DU GOUT
      </p>
    </footer>
  );
};

export default Footer;
