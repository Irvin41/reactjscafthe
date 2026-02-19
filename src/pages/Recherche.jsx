import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import "../styles/Home.css";
import "../styles/CategoryPage.css";

const normalize = (v) =>
  String(v ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

// Alignement sur 6 produits par page comme sur la page Café
const PRODUCTS_PER_PAGE = 6;

const Recherche = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const searchParam = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return normalize(params.get("q") ?? "");
  }, [location.search]);

  const rawQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("q") ?? "";
  }, [location.search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParam]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const endpoints = [`${baseUrl}/api/articles`, `${baseUrl}/api/article`];
        const allItems = [];

        for (const endpoint of endpoints) {
          const response = await fetch(endpoint);
          if (!response.ok) continue;
          const data = await response.json();
          const payload = data.article ?? data.articles ?? [];
          if (Array.isArray(payload)) allItems.push(...payload);
        }

        const uniqueById = Array.from(
          new Map(allItems.map((item) => [item.id_article, item])).values(),
        );
        setArticles(uniqueById);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchArticles();
  }, []);

  const results = useMemo(() => {
    if (!searchParam) return [];
    return articles.filter((a) => {
      const haystack = normalize(
        `${a.nom_article ?? ""} ${a.description ?? ""} ${a.categorie ?? ""} ${a.origine ?? ""}`,
      );
      return haystack.includes(searchParam);
    });
  }, [articles, searchParam]);

  const totalPages = Math.max(1, Math.ceil(results.length / PRODUCTS_PER_PAGE));

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return results.slice(start, start + PRODUCTS_PER_PAGE);
  }, [results, currentPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages],
  );

  return (
    // Ajout de la classe "cat-page--cafes" (ou équivalent) pour hériter des styles de grille
    <div className="cat-page cat-page--recherche">
      <section className="cat-hero section-padding">
        <div className="cat-hero-inner">
          <p className="cat-eyebrow">RÉSULTATS DE RECHERCHE</p>
          <h1 className="section-title">
            {rawQuery ? `« ${rawQuery} »` : "Recherche"}
          </h1>
          <p className="section-subtitle">
            {isLoading
              ? "Recherche en cours…"
              : `${results.length} produit${results.length !== 1 ? "s" : ""} trouvé${results.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </section>

      <section className="section-padding cat-list-section">
        {isLoading && (
          <div className="message-container">
            <h3 className="message-title">Recherche en cours</h3>
            <p className="message-text">Nous cherchons vos produits…</p>
          </div>
        )}

        {!isLoading && results.length === 0 && (
          <div className="message-container">
            <h3 className="message-title">Aucun résultat</h3>
            <p className="message-text">
              Aucun produit ne correspond à « {rawQuery} ».
            </p>
            <button
              type="button"
              className="bouton-principal" /* Utilisation de ta classe de bouton globale */
              style={{ marginTop: "24px" }}
              onClick={() => navigate("/")}
            >
              Retour à l'accueil
            </button>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <>
            {/* Utilisation de la même classe "grille-produits" que dans Cafes.jsx */}
            <div className="grille-produits">
              {paginatedArticles.map((article) => (
                <ProductCard key={article.id_article} produit={article} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="cat-pagination" aria-label="Pagination">
                <button
                  type="button"
                  className="cat-page-btn"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </button>

                <div className="cat-page-numbers">
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`cat-page-btn ${page === currentPage ? "is-active" : ""}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="cat-page-btn"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Recherche;
