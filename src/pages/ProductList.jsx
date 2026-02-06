import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import ProductCard from "../components/ProductCard.jsx";

const ProductList = () => {
  const [produits, setProduits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        setError(null);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/article`,
        );

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const data = await response.json();
        setProduits(data.article);
      } catch (err) {
        console.error("Erreur lors du chargement des produits :", err);
        setError("Impossible de charger les produits");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProduits();
  }, []);

  // Chargement : Skeleton
  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="product-skeleton">
            <Skeleton height={200} width={300} />
            <div style={{ marginTop: "0.5rem" }}>
              <Skeleton height={20} width="70%" />
            </div>
            <div style={{ marginTop: "0.3rem" }}>
              <Skeleton height={20} width="40%" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Erreur
  if (error) {
    return (
      <div>
        <div>
          <h3> Une erreur est survenue</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </div>
    );
  }

  // Affichage normal (si tout est OK)
  return (
    <div>
      <div className="product-list">
        {produits.map((produit) => (
          <ProductCard key={produit.id_article} produit={produit} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
