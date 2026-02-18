import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import "../styles/CategoryPage.css";
import "../styles/Home.css";

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const isTeaCollection = (article) => {
  const category = normalize(article?.categorie);
  return (
    category.startsWith("the_") ||
    category === "matcha" ||
    category === "infusion"
  );
};

const FILTERS = [
  { key: "all", label: "Tous" },
  { key: "noir", label: "Thé noir" },
  { key: "vert", label: "Thé vert" },
  { key: "blanc", label: "Thé blanc" },
  { key: "oolong", label: "Oolong" },
  { key: "matcha", label: "Matcha" },
  { key: "infusion", label: "Infusion" },
  { key: "bio", label: "Bio" },
];

const matchesFilter = (article, filterKey) => {
  if (filterKey === "all") return true;
  const category = normalize(article?.categorie);

  if (filterKey === "noir") return category === "the_noir";
  if (filterKey === "vert") return category === "the_vert";
  if (filterKey === "blanc") return category === "the_blanc";
  if (filterKey === "oolong") return category === "the_oolong";
  if (filterKey === "matcha") return category === "matcha";
  if (filterKey === "infusion") return category === "infusion";
  if (filterKey === "bio") {
    const name = normalize(article?.nom_article);
    const description = normalize(article?.description);
    const origine = normalize(article?.origine);
    return (
      category.includes("bio") ||
      name.includes("bio") ||
      description.includes("bio") ||
      origine.includes("bio")
    );
  }

  return true;
};

const PRODUCTS_PER_PAGE = 6;

const Thes = () => {
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
        console.error("Erreur lors du chargement des thés :", err);
        setError("Impossible de charger les thés pour le moment.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchArticles();
  }, []);

  const teaArticles = useMemo(() => {
    const base = articles.filter(isTeaCollection);
    return base.filter((article) => matchesFilter(article, selectedFilter));
  }, [articles, selectedFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(teaArticles.length / PRODUCTS_PER_PAGE),
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
    return teaArticles.slice(start, start + PRODUCTS_PER_PAGE);
  }, [teaArticles, currentPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  return (
    <div className="cat-page cat-page--thes">
      <section className="cat-hero section-padding">
        <div className="cat-hero-inner">
          <p className="cat-eyebrow">COLLECTION THÉ</p>
          <h1 className="section-title">Tous Nos Thés, Matcha et Infusions</h1>
          <p className="section-subtitle">
            Noir, vert, blanc, oolong, matcha et infusions dans une seule page.
          </p>
        </div>
      </section>

      <section className="section-padding cat-list-section">
        {!isLoading && !error && (
          <div
            className="cat-filters"
            role="tablist"
            aria-label="Filtrer les thés"
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
              Nous préparons votre sélection de thés.
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="message-container">
            <h3 className="message-title">Une erreur est survenue</h3>
            <p className="message-text">{error}</p>
          </div>
        )}

        {!isLoading && !error && teaArticles.length === 0 && (
          <div className="message-container">
            <h3 className="message-title">Aucun thé disponible</h3>
            <p className="message-text">
              Aucun thé, matcha ou infusion n&apos;est disponible pour le
              moment.
            </p>
          </div>
        )}

        {!isLoading && !error && teaArticles.length > 0 && (
          <>
            <div className="grille-produits">
              {paginatedArticles.map((article) => (
                <ProductCard key={article.id_article} produit={article} />
              ))}
            </div>

            <nav className="cat-pagination" aria-label="Pagination des thés">
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

export default Thes;
