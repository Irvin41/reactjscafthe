import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SearchBandeau.css";

const API = import.meta.env.VITE_API_URL;

const normalize = (v) =>
  String(v ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const SUGGESTIONS = [
  "Earl Grey",
  "Matcha",
  "Arabica",
  "Rooibos",
  "Darjeeling",
  "Sencha",
  "Espresso",
  "Coffret",
];

const SearchBandeau = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus auto à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Chargement des articles une seule fois
  useEffect(() => {
    fetch(`${API}/api/articles`)
      .then((r) => r.json())
      .then((d) => setArticles(d.articles || d.article || []))
      .catch(console.error);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = normalize(query);
    return articles
      .filter(
        (a) =>
          normalize(a.nom_article).includes(q) ||
          normalize(a.categorie).includes(q) ||
          normalize(a.description).includes(q),
      )
      .slice(0, 5);
  }, [query, articles]);

  const handleSearch = (q) => {
    const term = q || query;
    if (term.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(term.trim())}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="search-bandeau">
        {/* ── Barre de recherche ── */}
        <div className="search-bandeau-bar">
          <svg
            className="search-bandeau-icon"
            width="20"
            height="20"
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
          <input
            ref={inputRef}
            type="search"
            className="search-bandeau-input"
            placeholder="Rechercher un thé, un café, un accessoire…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
              if (e.key === "Escape") onClose();
            }}
          />
          <button
            className="search-bandeau-close"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="search-bandeau-divider" />

        {/* ── Corps ── */}
        <div className="search-bandeau-body">
          {/* Suggestions */}
          <div className="search-bandeau-suggestions">
            <p className="search-bandeau-label">Recherches populaires</p>
            <ul>
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => handleSearch(s)}>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Résultats */}
          <div className="search-bandeau-results">
            <p className="search-bandeau-label">
              {query.trim() ? "Résultats" : "Produits recommandés"}
            </p>
            <div className="search-bandeau-grid">
              {(query.trim() ? results : articles.slice(0, 5)).map((a) => (
                <button
                  key={a.id_article}
                  type="button"
                  className="search-bandeau-card"
                  onClick={() => {
                    navigate(`/produit/${a.id_article}`);
                    onClose();
                  }}
                >
                  <div className="search-bandeau-img-wrap">
                    <img
                      src={`${API}/images/${a.image}`}
                      alt={a.nom_article}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/200x200";
                      }}
                    />
                  </div>
                  <p className="search-bandeau-name">{a.nom_article}</p>
                  <p className="search-bandeau-price">
                    {Number(a.prix_ttc).toFixed(2).replace(".", ",")} €
                  </p>
                </button>
              ))}
              {query.trim() && results.length === 0 && (
                <p className="search-bandeau-empty">
                  Aucun résultat pour « {query} »
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className="search-bandeau-overlay" onClick={onClose} />
    </>
  );
};

export default SearchBandeau;
