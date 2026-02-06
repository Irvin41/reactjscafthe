import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const ProductDetails = () => {
  const { id } = useParams();

  const [produit, setProduit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduit = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/article/${id}`,
        );

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const data = await response.json();
        setProduit(data.article);
      } catch (err) {
        console.error("Erreur lors du chargement du produit :", err);
        setError("Impossible de charger le produit");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProduit();
  }, [id]);

  if (isLoading) {
    return (
      <div className="product-details-skeleton">
        <Skeleton height={400} width={400} />
        <div style={{ marginTop: 20 }}>
          <Skeleton height={30} width="50%" />
        </div>
        <div style={{ marginTop: 10 }}>
          <Skeleton height={20} width="80%" />
          <Skeleton height={20} width="60%" />
          <Skeleton height={20} width="40%" />
        </div>
      </div>
    );
  }

  // Erreur
  if (error) {
    return (
      <div className="product-list-error">
        <div className="error-container">
          <h3> Une erreur est survenue</h3>
          <p>{error}</p>
          <Link to="/" className="back-link">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  // Image provenant de l'API
  const imageUrl = produit.image
    ? `${import.meta.env.VITE_API_URL}/images/${produit.image}`
    : `https://placehold.co/300x300?text=${produit.nom_article}`;

  return (
    <div className="product-details">
      <img src={imageUrl} alt={produit.nom_article} />
      <h2>{produit.nom_article}</h2>
      <p>{produit.description}</p>
      <p>
        <strong>PRIX TTC :</strong> {produit.prix_ttc} €
      </p>
      <p>
        <strong>Stock :</strong> {produit.stock} unités disponibles
      </p>
      <Link to="/" className="back-link">
        Retour aux produits
      </Link>
    </div>
  );
};

export default ProductDetails;
