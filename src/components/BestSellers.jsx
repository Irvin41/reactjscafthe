import { useEffect, useState } from "react";
import ProductCard from "./ProductCard.jsx";

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

  if (isLoading) {
    return (
      <div className="centre bloc">
        <p>Chargement des meilleures ventes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="centre bloc">
        <h3>Une erreur est survenue</h3>
        <p className="discret">{error}</p>
        <button
          className="bouton bouton-secondaire"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (bestSellers.length === 0) {
    return (
      <div className="centre bloc">
        <p className="discret">Aucune vente disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="grille-produits">
      {bestSellers.map((article) => (
        <ProductCard key={article.id_article} produit={article} />
      ))}
    </div>
  );
};

export default BestSellers;
