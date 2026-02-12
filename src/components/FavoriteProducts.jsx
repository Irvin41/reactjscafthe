import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "./ProductCard.jsx";
import "../styles/BestSellers.css";

const FavoriteProducts = () => {
  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      // Attendre que l'authentification soit vérifiée
      if (authLoading) return;

      // Si pas connecté, pas besoin de fetch
      if (!isAuthenticated || !user?.id_client) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/article/favorites/${user.id_client}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setFavorites(data.articles);
      } catch (err) {
        console.error("Erreur lors du chargement des favoris :", err);
        setError("Impossible de charger vos produits favoris");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchFavorites();
  }, [user, isAuthenticated, authLoading]);

  // Chargement de l'authentification
  if (authLoading || isLoading) {
    return (
      <div className="message-container">
        <p>Chargement de vos favoris...</p>
      </div>
    );
  }

  // Utilisateur non connecté
  if (!isAuthenticated) {
    return (
      <div className="message-container">
        <h3 className="message-title">Connectez-vous pour voir vos favoris</h3>
        <p className="message-text">
          Vos produits préférés s'afficheront ici après connexion
        </p>
      </div>
    );
  }

  // Erreur
  if (error) {
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
  }

  // Aucun favori
  if (favorites.length === 0) {
    return (
      <div className="message-container">
        <h3 className="message-title">
          Vous n'avez pas encore de produits favoris
        </h3>
        <p className="message-text">
          Commencez à commander pour voir vos préférences ici !
        </p>
      </div>
    );
  }

  // Affichage normal
  return (
    <div>
      <div className="products-layout-grid">
        {favorites.map((article) => (
          <ProductCard key={article.id_article} produit={article} />
        ))}
      </div>
    </div>
  );
};

export default FavoriteProducts;
