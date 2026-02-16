import { useEffect, useState } from "react";
import ProductCard from "./ProductCard.jsx";
import "../styles/BestSellers.css";

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setError(null);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/articles/bestseller`,
        );

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const data = await response.json();
        const baseArticles = data.articles || [];

        const detailedArticles = await Promise.all(
          baseArticles.map(async (article) => {
            if (!article?.id_article) return article;
            try {
              const detailResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/articles/${article.id_article}`,
              );
              if (!detailResponse.ok) return article;
              const detailData = await detailResponse.json();
              return detailData.article || article;
            } catch {
              return article;
            }
          }),
        );

        setBestSellers(detailedArticles);
      } catch (err) {
        console.error("Erreur lors du chargement des best-sellers :", err);
        setError("Impossible de charger les meilleures ventes");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchBestSellers();
  }, []);

  // Chargement
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Chargement des meilleures ventes...</p>
      </div>
    );
  }

  // Erreur
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h3>Une erreur est survenue</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  // Aucun best-seller
  if (bestSellers.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Aucune vente disponible pour le moment</p>
      </div>
    );
  }

  // Affichage normal
  return (
    <div>
      <div className="products-layout-grid">
        {bestSellers.map((article) => (
          <ProductCard key={article.id_article} produit={article} />
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
