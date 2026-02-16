import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import "../styles/Coffrets.css";
import "../styles/Home.css";
import "../styles/BestSellers.css";

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const isCoffret = (article) => normalize(article?.categorie) === "coffret";

const FILTERS = [
  { key: "all", label: "Tous" },
  { key: "cafe", label: "Café" },
  { key: "the", label: "Thé" },
  { key: "infusion", label: "Infusion" },
  { key: "barista", label: "Barista" },
];

const matchesFilter = (article, filterKey) => {
  if (filterKey === "all") return true;
  const haystack = normalize(
    `${article?.nom_article ?? ""} ${article?.description ?? ""} ${article?.origine ?? ""}`,
  );

  if (filterKey === "cafe") return haystack.includes("cafe");
  if (filterKey === "the") return haystack.includes("the") || haystack.includes("matcha");
  if (filterKey === "infusion") return haystack.includes("infusion");
  if (filterKey === "barista") return haystack.includes("barista");

  return true;
};

const PRODUCTS_PER_PAGE = 6;

const Coffrets = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setError(null);
        const baseUrl = import.meta.env.VITE_API_URL;
        const endpoints = [`${baseUrl}/api/articles`, `${baseUrl}/api/article`];
        const allItems = [];
        let hasSuccessfulResponse = false;

        for (const endpoint of endpoints) {
          const response = await fetch(endpoint);
          if (!response.ok) continue;
          hasSuccessfulResponse = true;
          const data = await response.json();
          const payload = data.article ?? data.articles ?? [];
          if (Array.isArray(payload)) allItems.push(...payload);
        }

        if (!hasSuccessfulResponse) {
          throw new Error("Aucun endpoint article disponible");
        }

        const uniqueById = Array.from(
          new Map(allItems.map((item) => [item.id_article, item])).values(),
        );
        setArticles(uniqueById);
      } catch (err) {
        console.error("Erreur lors du chargement des coffrets :", err);
        setError("Impossible de charger les coffrets pour le moment.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchArticles();
  }, []);

  const coffretArticles = useMemo(() => {
    const base = articles.filter(isCoffret);
    return base.filter((article) => matchesFilter(article, selectedFilter));
  }, [articles, selectedFilter]);

  const totalPages = Math.max(1, Math.ceil(coffretArticles.length / PRODUCTS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return coffretArticles.slice(start, start + PRODUCTS_PER_PAGE);
  }, [coffretArticles, currentPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  return (
    <div className="coffrets-page">
      <section className="coffrets-hero section-padding">
        <div className="coffrets-hero-inner">
          <p className="coffrets-eyebrow">COLLECTION COFFRETS</p>
          <h1 className="section-title">Tous Nos Coffrets</h1>
          <p className="section-subtitle">
            Des coffrets découverte, barista et thés à offrir ou à s&apos;offrir.
          </p>
        </div>
      </section>

      <section className="section-padding coffrets-list-section">
        {!isLoading && !error && (
          <div
            className="coffrets-filters"
            role="tablist"
            aria-label="Filtrer les coffrets"
          >
            {FILTERS.map((filter) => (
              <button
                key={filter.key}
                type="button"
                className={`coffrets-filter-btn ${selectedFilter === filter.key ? "is-active" : ""}`}
                onClick={() => setSelectedFilter(filter.key)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="message-container">
            <h3 className="message-title">Chargement en cours</h3>
            <p className="message-text">
              Nous préparons votre sélection de coffrets.
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="message-container">
            <h3 className="message-title">Une erreur est survenue</h3>
            <p className="message-text">{error}</p>
          </div>
        )}

        {!isLoading && !error && coffretArticles.length === 0 && (
          <div className="message-container">
            <h3 className="message-title">Aucun coffret disponible</h3>
            <p className="message-text">
              Aucun coffret ne correspond au filtre sélectionné.
            </p>
          </div>
        )}

        {!isLoading && !error && coffretArticles.length > 0 && (
          <>
            <div className="products-layout-grid">
              {paginatedArticles.map((article) => (
                <ProductCard key={article.id_article} produit={article} />
              ))}
            </div>

            <nav className="coffrets-pagination" aria-label="Pagination des coffrets">
              <button
                type="button"
                className="coffrets-page-btn"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </button>

              <div className="coffrets-page-numbers">
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`coffrets-page-btn ${page === currentPage ? "is-active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="coffrets-page-btn"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </nav>
          </>
        )}
      </section>
    </div>
  );
};

export default Coffrets;
