import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import "../styles/Home.css";
import "../styles/BestSellers.css";
import "../styles/CategoryPage.css";

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const FILTERS_CONFIG = {
  all: { label: "Tous", sub: [] },
  cafe: {
    label: "Cafés",
    sub: [
      { key: "grains", label: "En Grains" },
      { key: "moulu", label: "Moulu" },
      { key: "capsule", label: "Capsules" },
      { key: "bio", label: "Bio" },
    ],
  },
  the: {
    label: "Thés",
    sub: [
      { key: "noir", label: "Thé Noir" },
      { key: "vert", label: "Thé Vert" },
      { key: "blanc", label: "Thé Blanc" },
      { key: "matcha", label: "Matcha" },
      { key: "infusion", label: "Infusions" },
      { key: "bio", label: "Bio" },
    ],
  },
  accessoire: { label: "Accessoires", sub: [] },
  coffret: { label: "Coffrets", sub: [] },
};

const PRODUCTS_PER_PAGE = 6;

const Shop = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [mainFilter, setMainFilter] = useState("all");
  const [subFilter, setSubFilter] = useState("all");

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
        console.error("Erreur de chargement", err);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const cat = normalize(a.categorie);
      const name = normalize(a.nom_article || a.nom || "");

      if (mainFilter === "all") return true;

      if (mainFilter === "cafe") {
        const isCoffeeRelated = cat.includes("cafe") || cat.includes("capsule");
        if (!isCoffeeRelated) return false;
        if (subFilter === "all") return true;
        if (subFilter === "bio")
          return cat.includes("bio") || name.includes("bio");
        return cat.includes(subFilter);
      }

      if (mainFilter === "the") {
        const isTeaRelated =
          cat.includes("the") ||
          cat.includes("matcha") ||
          cat.includes("infusion");
        if (!isTeaRelated) return false;
        if (subFilter === "all") return true;
        if (subFilter === "bio")
          return cat.includes("bio") || name.includes("bio");
        return cat.includes(subFilter);
      }

      if (cat.includes(mainFilter)) {
        if (subFilter === "all") return true;
        return cat.includes(subFilter);
      }

      return false;
    });
  }, [articles, mainFilter, subFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [mainFilter, subFilter]);

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredArticles.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const totalPages = Math.ceil(filteredArticles.length / PRODUCTS_PER_PAGE);

  return (
    <div className="cat-page">
      <section className="cat-hero section-padding">
        <div className="cat-hero-inner">
          <p className="cat-eyebrow">BOUTIQUE</p>
          <h1 className="section-title">Tout notre Univers</h1>
        </div>
      </section>

      <section className="section-padding cat-list-section">
        <div className="cat-filters">
          {Object.keys(FILTERS_CONFIG).map((key) => (
            <button
              key={key}
              className={`cat-filter-btn ${mainFilter === key ? "is-active" : ""}`}
              onClick={() => {
                setMainFilter(key);
                setSubFilter("all");
              }}
            >
              {FILTERS_CONFIG[key].label}
            </button>
          ))}
        </div>

        {FILTERS_CONFIG[mainFilter].sub.length > 0 && (
          <div
            className="cat-filters"
            style={{ borderTop: "none", paddingTop: "0" }}
          >
            <button
              className={`cat-filter-btn ${subFilter === "all" ? "is-active" : ""}`}
              onClick={() => setSubFilter("all")}
            >
              Tous
            </button>
            {FILTERS_CONFIG[mainFilter].sub.map((sub) => (
              <button
                key={sub.key}
                className={`cat-filter-btn ${subFilter === sub.key ? "is-active" : ""}`}
                onClick={() => setSubFilter(sub.key)}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="message-container">
            <h3 className="message-title">Chargement...</h3>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="message-container">
            <h3 className="message-title">Aucun article trouvé</h3>
          </div>
        ) : (
          <>
            <div className="products-layout-grid" style={{ marginTop: "30px" }}>
              {paginatedArticles.map((article) => (
                <ProductCard key={article.id_article} produit={article} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="cat-pagination" style={{ marginTop: "40px" }}>
                <button
                  className="cat-page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Précédent
                </button>
                <div className="cat-page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`cat-page-btn ${page === currentPage ? "is-active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>
                <button
                  className="cat-page-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
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

export default Shop;
