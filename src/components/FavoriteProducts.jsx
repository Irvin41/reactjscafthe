import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "./ProductCard.jsx";

const API = import.meta.env.VITE_API_URL;

const FavoriteProducts = () => {
  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useContext(AuthContext);
  const id = user?.id_client || user?.id;

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
      <div className="centre bloc">
        <p>Chargement de vos favoris...</p>
      </div>
    );

  if (!isAuthenticated)
    return (
      <div className="centre bloc">
        <h3>Connectez-vous pour voir vos favoris</h3>
        <p className="texte discret">
          Vos produits préférés s'afficheront ici après connexion
        </p>
      </div>
    );

  if (error)
    return (
      <div className="centre bloc">
        <h3>Une erreur est survenue</h3>
        <p className="texte discret">{error}</p>
        <button
          className="bouton bouton-secondaire"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );

  if (favorites.length === 0)
    return (
      <div className="centre bloc">
        <h3>Vous n'avez pas encore de commandes</h3>
        <p className="texte discret">
          Vos 3 produits les plus commandés apparaîtront ici !
        </p>
      </div>
    );

  return (
    <div className="grille-produits">
      {favorites.map((article) => (
        <ProductCard key={article.id_article} produit={article} />
      ))}
    </div>
  );
};

export default FavoriteProducts;
