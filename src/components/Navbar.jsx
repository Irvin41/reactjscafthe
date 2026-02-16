import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import logo from "../assets/logo-cafthe.png";
import CartDrawer from "./CartDrawer.jsx";
import SearchBandeau from "../pages/SearchBandeau.jsx";
import "../styles/Navbar.css";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { itemCount, toggleCart } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const closeSearch = () => setSearchOpen(false);

  return (
    <header>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo-section">
            <Link to="/" className="logo">
              <img src={logo} alt="CAF'THÉ" />
            </Link>

            <button
              className={`burger-btn ${isMenuOpen ? "is-open" : ""}`}
              type="button"
              onClick={() => setIsMenuOpen((p) => !p)}
            >
              <span />
              <span />
              <span />
            </button>

            <ul className={`nav-menu ${isMenuOpen ? "is-open" : ""}`}>
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

          <div className={`nav-actions ${isMenuOpen ? "is-open" : ""}`}>
            {/* Loupe */}
            <button
              className="nav-search-btn"
              type="button"
              aria-label="Rechercher"
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
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button className="cart-btn-nav" onClick={toggleCart}>
              Mon Panier
              {itemCount > 0 && <span className="badge">{itemCount}</span>}
            </button>

            {isAuthenticated ? (
              <div className="user-logged">
                <Link
                  to="/profile"
                  className="account-link"
                  onClick={closeMenu}
                >
                  {user?.prenom ?? ""}
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
          <button className="nav-overlay" type="button" onClick={closeMenu} />
        )}
      </nav>

      {/* ── Bandeau recherche ── */}
      <SearchBandeau isOpen={searchOpen} onClose={closeSearch} />

      <CartDrawer />
    </header>
  );
};

export default Navbar;
