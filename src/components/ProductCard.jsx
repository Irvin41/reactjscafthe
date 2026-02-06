import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ produit }) => {
  // image provenant de l'api
  const imageUrl = produit.image
    ? `${import.meta.env.VITE_API_URL}/images/${produit.image}`
    : "https://placehold.co/600x400";
  console.log(produit);
  return (
    <div className="prorduct-card">
      <img
        src={imageUrl}
        alt={produit.nom_produit}
        className="product-card-image"
      />
      <h3>{produit.nom_article}</h3>
      <p>
        <strong>PRIX TTC :</strong> {produit.prix_ttc} €
      </p>
      <Link to={`/produit/${produit.id_article}`} className="detail-btn">
        Voir Détails
      </Link>
    </div>
  );
};

export default ProductCard;
