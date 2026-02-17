import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import "../styles/CategoryPage.css";
import "../styles/Home.css";
import "../styles/BestSellers.css";

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const isAccessory = (article) => normalize(article?.categorie) === "accessoire";

const FILTERS = [
  { key: "all", label: "Tous" },
  { key: "the", label: "Thé" },
  { key: "cafe", label: "Café" },
  { key: "conservation", label: "Conservation" },
];

const matchesFilter = (article, filterKey) => {
  if (filterKey === "all") return true;
  const haystack = normalize(
    `${article?.nom_article ?? ""} ${article?.description ?? ""} ${article?.origine ?? ""}`,
  );

  if (filterKey === "the") {
    return haystack.includes("the") || haystack.includes("infuseur");
  }
  if (filterKey === "cafe") {
    return (
      haystack.includes("cafe") ||
      haystack.includes("cafetiere") ||
      haystack.includes("moulin") ||
      haystack.includes("barista")
    );
  }
  if (filterKey === "conservation") {
    return (
      haystack.includes("boite") ||
      haystack.includes("conservation") ||
      haystack.includes("hermetique")
    );
  }

  return true;
};

const PRODUCTS_PER_PAGE = 6;

const Accessoires = () => {
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
        console.error("Erreur lors du chargement des accessoires :", err);
        setError("Impossible de charger les accessoires pour le moment.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchArticles();
  }, []);

  const accessoryArticles = useMemo(() => {
    const base = articles.filter(isAccessory);
    return base.filter((article) => matchesFilter(article, selectedFilter));
  }, [articles, selectedFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(accessoryArticles.length / PRODUCTS_PER_PAGE),
  );

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
    return accessoryArticles.slice(start, start + PRODUCTS_PER_PAGE);
  }, [accessoryArticles, currentPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  return (
    <div className="cat-page cat-page--accessoires">
      <section className="cat-hero section-padding">
        <div className="cat-hero-inner">
          <p className="cat-eyebrow">COLLECTION ACCESSOIRES</p>
          <h1 className="section-title">Tous Nos Accessoires</h1>
          <p className="section-subtitle">
            Théières, infuseurs, moulins, cafetières et tout le nécessaire.
          </p>
        </div>
      </section>

      <section className="section-padding cat-list-section">
        {!isLoading && !error && (
          <div
            className="cat-filters"
            role="tablist"
            aria-label="Filtrer les accessoires"
          >
            {FILTERS.map((filter) => (
              <button
                key={filter.key}
                type="button"
                className={`cat-filter-btn ${selectedFilter === filter.key ? "is-active" : ""}`}
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
              Nous préparons votre sélection d&apos;accessoires.
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="message-container">
            <h3 className="message-title">Une erreur est survenue</h3>
            <p className="message-text">{error}</p>
          </div>
        )}

        {!isLoading && !error && accessoryArticles.length === 0 && (
          <div className="message-container">
            <h3 className="message-title">Aucun accessoire disponible</h3>
            <p className="message-text">
              Aucun accessoire ne correspond au filtre sélectionné.
            </p>
          </div>
        )}

        {!isLoading && !error && accessoryArticles.length > 0 && (
          <>
            <div className="products-layout-grid">
              {paginatedArticles.map((article) => (
                <ProductCard key={article.id_article} produit={article} />
              ))}
            </div>

            <nav
              className="cat-pagination"
              aria-label="Pagination des accessoires"
            >
              <button
                type="button"
                className="cat-page-btn"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="cat-page-btn"
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

export default Accessoires;
