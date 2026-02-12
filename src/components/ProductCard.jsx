import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatText } from "../utils/formatters";
import { useCart } from "../context/CartContext"; // Import du hook useCart

const ProductCard = ({ produit, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart(); // Récupération de la fonction addToCart du contexte

  // image provenant de l'api
  const imageUrl = produit.image
    ? `${import.meta.env.VITE_API_URL}/images/${produit.image}`
    : "https://placehold.co/600x400";

  const handleAddToCart = (e) => {
    e.preventDefault();
    setIsAdding(true);

    // Si une fonction onAddToCart est passée en prop, l'utiliser
    if (onAddToCart) {
      onAddToCart(produit);
    } else {
      // Sinon, utiliser la fonction du contexte
      addToCart(produit);
    }

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  console.log(produit);

  return (
    <article className="product-item-card">
      <div className="product-image-wrap">
        {produit.badge && (
          <div className="badge badge-color">{produit.badge}</div>
        )}

        <img src={imageUrl} alt="" className="product-image" loading="lazy" />
      </div>

      <div className="product-body">
        <div className="prod-meta-row">
          {produit.categorie && (
            <span className="prod-meta">{formatText(produit.categorie)}</span>
          )}
          {produit.origine && (
            <span className="prod-meta">{formatText(produit.origine)}</span>
          )}
        </div>

        <h3 className="prod-name">{produit.nom_article}</h3>

        {/* Affiche la description courte pour la carte produit */}
        {produit.description && (
          <p className="prod-desc-short">{produit.description}</p>
        )}

        <div className="prod-footer-row">
          <span className="prod-price">{produit.prix_ttc} €</span>

          <div className="prod-actions">
            <Link
              to={`/produit/${produit.id_article}`}
              className="btn-view-details"
              title="Voir les détails"
            >
              Détails
            </Link>

            <button
              className={`btn-add-to-cart ${isAdding ? "adding" : ""}`}
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? <>Ajouté</> : <> Ajouter</>}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
