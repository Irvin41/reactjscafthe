import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { NavLink, Link } from "react-router-dom"; // On utilise NavLink pour le statut "active"
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

            {/* --- NAVIGATION PRINCIPALE (Ceux qui seront soulignés) --- */}
            <ul
              id="main-nav-menu"
              className={`nav-menu ${isMenuOpen ? "is-open" : ""}`}
              role="menubar"
            >
              <li role="none">
                <NavLink to="/cafes" role="menuitem" onClick={closeMenu}>
                  Cafés
                </NavLink>
              </li>
              <li role="none">
                <NavLink to="/thes" role="menuitem" onClick={closeMenu}>
                  Thés
                </NavLink>
              </li>
              <li role="none">
                <NavLink to="/accessoires" role="menuitem" onClick={closeMenu}>
                  Accessoires
                </NavLink>
              </li>
              <li role="none">
                <NavLink to="/coffrets" role="menuitem" onClick={closeMenu}>
                  Coffrets
                </NavLink>
              </li>
              <li role="none">
                <NavLink to="/a-propos" role="menuitem" onClick={closeMenu}>
                  À Propos
                </NavLink>
              </li>
            </ul>
          </div>

          {/* --- ACTIONS UTILISATEUR (Ceux qui ne seront PAS soulignés) --- */}
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
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button
              className="cart-btn-nav"
              type="button"
              onClick={toggleCart}
              aria-label="Mon panier"
            >
              Mon Panier
              {itemCount > 0 && (
                <span className="badge" aria-hidden="true">
                  {itemCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="user-logged" role="group">
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
          />
        )}
      </nav>

      <SearchBandeau isOpen={searchOpen} onClose={closeSearch} />
      <CartDrawer />
    </header>
  );
};

export default Navbar;
