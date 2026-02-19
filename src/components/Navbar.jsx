import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { NavLink, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import logo from "../assets/logo-cafthe.png";
import CartDrawer from "./CartDrawer.jsx";
import SearchBandeau from "../pages/SearchBandeau.jsx";
import ThemeToggle from "./ThemeToggle.jsx"; // 🌙 Importation du switch
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
              onClick={() => setIsMenuOpen((p) => !p)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>

            <ul
              id="main-nav-menu"
              className={`nav-menu ${isMenuOpen ? "is-open" : ""}`}
            >
              <li>
                <NavLink to="/cafes" onClick={closeMenu}>
                  Cafés
                </NavLink>
              </li>
              <li>
                <NavLink to="/thes" onClick={closeMenu}>
                  Thés
                </NavLink>
              </li>
              <li>
                <NavLink to="/accessoires" onClick={closeMenu}>
                  Accessoires
                </NavLink>
              </li>
              <li>
                <NavLink to="/coffrets" onClick={closeMenu}>
                  Coffrets
                </NavLink>
              </li>
              <li>
                <NavLink to="/a-propos" onClick={closeMenu}>
                  À Propos
                </NavLink>
              </li>
            </ul>
          </div>

          <div className={`nav-actions ${isMenuOpen ? "is-open" : ""}`}>
            <button
              className="nav-search-btn"
              onClick={() => setSearchOpen((p) => !p)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button className="cart-btn-nav" onClick={toggleCart}>
              Mon Panier{" "}
              {itemCount > 0 && <span className="badge">{itemCount}</span>}
            </button>

            {isAuthenticated ? (
              <div className="user-logged">
                <Link
                  to="/profile"
                  className="account-link"
                  onClick={closeMenu}
                >
                  {user?.prenom ?? "Mon profil"}
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

            {/* 🌙 LE TOGGLE EST ICI TOUT À DROITE */}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <SearchBandeau isOpen={searchOpen} onClose={closeSearch} />
      <CartDrawer />
    </header>
  );
};

export default Navbar;
