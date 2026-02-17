import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import logo from "../assets/logo-cafthe.png";
import CartDrawer from "./CartDrawer.jsx";
import SearchBandeau from "../pages/SearchBandeau.jsx";
import "../styles/Navbar.css";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const { itemCount, toggleCart } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const closeSearch = () => setSearchOpen(false);

  return (
    <header role="banner">
      <nav className="navbar" aria-label="Navigation principale">
        <div className="nav-container">
          <div className="logo-section">
            <Link to="/" className="logo" aria-label="CAF'THÉ — Accueil">
              <img src={logo} alt="CAF'THÉ" />
            </Link>

            <button
              className={`burger-btn ${isMenuOpen ? "is-open" : ""}`}
              type="button"
              aria-label="Menu de navigation"
              aria-expanded={isMenuOpen}
              aria-controls="main-nav-menu"
              onClick={() => setIsMenuOpen((p) => !p)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>

            <ul
              id="main-nav-menu"
              className={`nav-menu ${isMenuOpen ? "is-open" : ""}`}
              role="menubar"
            >
              <li role="none">
                <Link to="/cafes" role="menuitem" onClick={closeMenu}>
                  Cafés
                </Link>
              </li>
              <li role="none">
                <Link to="/thes" role="menuitem" onClick={closeMenu}>
                  Thés
                </Link>
              </li>
              <li role="none">
                <Link to="/accessoires" role="menuitem" onClick={closeMenu}>
                  Accessoires
                </Link>
              </li>
              <li role="none">
                <Link to="/coffrets" role="menuitem" onClick={closeMenu}>
                  Coffrets
                </Link>
              </li>
              <li role="none">
                <Link to="/a-propos" role="menuitem" onClick={closeMenu}>
                  À Propos
                </Link>
              </li>
            </ul>
          </div>

          <div
            className={`nav-actions ${isMenuOpen ? "is-open" : ""}`}
            role="group"
            aria-label="Actions utilisateur"
          >
            <button
              className="nav-search-btn"
              type="button"
              aria-label="Rechercher"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((p) => !p)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button
              className="cart-btn-nav"
              type="button"
              onClick={toggleCart}
              aria-label={`Mon panier${itemCount > 0 ? `, ${itemCount} article${itemCount > 1 ? "s" : ""}` : ", vide"}`}
            >
              Mon Panier
              {itemCount > 0 && (
                <span className="badge" aria-hidden="true">
                  {itemCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div
                className="user-logged"
                role="group"
                aria-label="Compte utilisateur"
              >
                <Link
                  to="/profile"
                  className="account-link"
                  onClick={closeMenu}
                >
                  {user?.prenom ?? "Mon profil"}
                </Link>
                <button
                  className="account-link-red"
                  type="button"
                  onClick={logout}
                >
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
          <div
            className="nav-overlay"
            role="presentation"
            onClick={closeMenu}
            onKeyDown={(e) => e.key === "Escape" && closeMenu()}
          />
        )}
      </nav>

      <SearchBandeau isOpen={searchOpen} onClose={closeSearch} />

      <CartDrawer />
    </header>
  );
};

export default Navbar;
