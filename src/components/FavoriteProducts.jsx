import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "./ProductCard.jsx";
import "../styles/BestSellers.css";

const API = import.meta.env.VITE_API_URL;

const FavoriteProducts = () => {
  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useContext(AuthContext);
  const id = user?.id_client || user?.id; // supporte les deux formats

  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !id) {
      setIsLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${API}/api/articles/favoris/${id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

        const data = await response.json();
        const baseArticles = data.articles || [];

        const detailedArticles = await Promise.all(
          baseArticles.map(async (article) => {
            if (!article?.id_article) return article;
            try {
              const detailResponse = await fetch(
                `${API}/api/articles/${article.id_article}`,
              );
              if (!detailResponse.ok) return article;
              const detailData = await detailResponse.json();
              return detailData.article || article;
            } catch {
              return article;
            }
          }),
        );

        setFavorites(detailedArticles);
      } catch (err) {
        console.error("Erreur favoris :", err);
        setError("Impossible de charger vos produits favoris");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchFavorites();
  }, [id, isAuthenticated, authLoading]);

  if (authLoading || isLoading)
    return (
      <div className="message-container">
        <p>Chargement de vos favoris...</p>
      </div>
    );

  if (!isAuthenticated)
    return (
      <div className="message-container">
        <h3 className="message-title">Connectez-vous pour voir vos favoris</h3>
        <p className="message-text">
          Vos produits préférés s'afficheront ici après connexion
        </p>
      </div>
    );

  if (error)
    return (
      <div className="message-container">
        <h3 className="message-title">Une erreur est survenue</h3>
        <p className="message-text">{error}</p>
        <button
          className="btn-view-details"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );

  if (favorites.length === 0)
    return (
      <div className="message-container">
        <h3 className="message-title">Vous n'avez pas encore de commandes</h3>
        <p className="message-text">
          Vos 3 produits les plus commandés apparaîtront ici !
        </p>
      </div>
    );

  return (
    <div className="products-layout-grid">
      {favorites.map((article) => (
        <ProductCard key={article.id_article} produit={article} />
      ))}
    </div>
  );
};

export default FavoriteProducts;
