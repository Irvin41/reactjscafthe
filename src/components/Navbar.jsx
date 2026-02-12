import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import logo from "../assets/logo-cafthe.png";
import CartDrawer from "./CartDrawer.jsx";
import "../styles/Navbar.css";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { itemCount, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo-section">
          <Link to="/" className="logo">
            <img src={logo} alt="CAF'THÉ" />
          </Link>

          <button
            className={`burger-btn ${isMenuOpen ? "is-open" : ""}`}
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>

          <ul
            id="primary-navigation"
            className={`nav-menu ${isMenuOpen ? "is-open" : ""}`}
          >
            <li>
              <Link to="/cafes" onClick={closeMenu}>
                Cafés
              </Link>
            </li>
            <li>
              <Link to="/thes" onClick={closeMenu}>
                Thés
              </Link>
            </li>
            <li>
              <Link to="/accessoires" onClick={closeMenu}>
                Accessoires
              </Link>
            </li>
            <li>
              <Link to="/coffrets" onClick={closeMenu}>
                Coffrets
              </Link>
            </li>
            <li>
              <Link to="/a-propos" onClick={closeMenu}>
                À Propos
              </Link>
            </li>
          </ul>
        </div>

        {/* Section droite : Panier + Compte */}
        <div className={`nav-actions ${isMenuOpen ? "is-open" : ""}`}>
          <button className="cart-btn-nav" onClick={toggleCart}>
            Mon Panier
            {itemCount > 0 && <span className="badge">{itemCount}</span>}
          </button>

          {isAuthenticated ? (
            <div className="user-logged">
              <Link to="/profile" className="account-link" onClick={closeMenu}>
                {user ? user.prenom : ""}
              </Link>
              <button className="account-link-red" onClick={logout}>
                Déconnexion
              </button>
            </div>
          ) : (
            <Link to="/login" className="account-link" onClick={closeMenu}>
              Mon Compte
            </Link>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <button
          className="nav-overlay"
          type="button"
          aria-label="Fermer le menu"
          onClick={closeMenu}
        />
      )}

      <CartDrawer />
    </nav>
  );
};

export default Navbar;
