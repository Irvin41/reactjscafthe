import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatStock, formatText } from "../utils/formatters";
import "../styles/ProductDetail.css";

const CATEGORIES_POIDS = [
  "Cafe_grains",
  "Cafe_moulu",
  "The_noir",
  "The_vert",
  "The_blanc",
  "The_Oolong",
  "Infusion",
  "Matcha",
];

const getPoidsByCategorie = (categorie) => {
  if (!categorie) return [];
  if (categorie.startsWith("Cafe")) return ["100g", "250g", "500g"];
  if (categorie === "Matcha") return ["30g", "100g", "200g"];
  return ["50g", "100g", "200g", "20 sachets"];
};

const getPoidsBase = (categorie) => {
  if (!categorie) return 250;
  if (categorie.startsWith("Cafe")) return 250;
  return 100;
};

const poidsEnGrammes = (poids) => {
  if (!poids || poids === "20 sachets") return null;
  if (poids.endsWith("kg")) return parseFloat(poids) * 1000;
  return parseFloat(poids);
};

const calculerPrix = (prixBase, categorie, selectedPoids) => {
  if (!prixBase || !selectedPoids) return prixBase;
  if (selectedPoids === "20 sachets") {
    return (parseFloat(prixBase) * 1.2).toFixed(2);
  }
  const grammes = poidsEnGrammes(selectedPoids);
  const grammesBase = getPoidsBase(categorie);
  return ((parseFloat(prixBase) * grammes) / grammesBase).toFixed(2);
};

const isCafeThe = (categorie) => CATEGORIES_POIDS.includes(categorie);

const ProductCard = ({ produit, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState("1");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPoids, setSelectedPoids] = useState(() => {
    const poids = getPoidsByCategorie(produit?.categorie);
    if (poids.length === 0) return null;
    const base = getPoidsBase(produit?.categorie);
    return poids.find((p) => poidsEnGrammes(p) === base) || poids[0];
  });
  const { addToCart } = useCart();

  const imageUrl = produit.image
    ? `${import.meta.env.VITE_API_URL}/images/${produit.image}`
    : "https://placehold.co/600x400";

  const afficherPoids = isCafeThe(produit.categorie);
  const poidsDisponibles = getPoidsByCategorie(produit.categorie);
  const prixAffiche = afficherPoids
    ? calculerPrix(produit.prix_ttc, produit.categorie, selectedPoids)
    : Number(produit.prix_ttc).toFixed(2);

  const maxStock =
    typeof produit.stock === "number" && produit.stock > 0 ? produit.stock : 99;

  const decreaseQuantity = () => {
    setQuantity((prev) => {
      const next = Math.max(1, prev - 1);
      setQuantityInput(String(next));
      return next;
    });
  };

  const increaseQuantity = () => {
    setQuantity((prev) => {
      const next = Math.min(maxStock, prev + 1);
      setQuantityInput(String(next));
      return next;
    });
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    const add = onAddToCart ?? addToCart;
    const itemToAdd = afficherPoids
      ? {
          ...produit,
          poids: selectedPoids,
          prix_ttc: calculerPrix(
            produit.prix_ttc,
            produit.categorie,
            selectedPoids,
          ),
        }
      : produit;
    for (let i = 0; i < quantity; i += 1) {
      add(itemToAdd);
    }
    setTimeout(() => setIsAdding(false), 800);
  };

  return (
    <article className="carte-produit carte-produit--colonne">
      <h3 className="produit-nom produit-nom--haut">{produit.nom_article}</h3>

      <Link
        to={`/produit/${produit.id_article}`}
        className="produit-image-lien"
        title={`Voir le produit ${produit.nom_article}`}
      >
        <div className="detail-image-boite">
          {produit.categorie && (
            <div className="detail-pastille">
              {formatText(produit.categorie)}
            </div>
          )}
          <img
            src={imageUrl}
            alt={produit.nom_article}
            className="detail-image"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/600x600?text=Image+non+disponible";
            }}
          />
        </div>
      </Link>

      <p className="produit-desc produit-desc--colonne">
        {produit.description || "Description indisponible."}
      </p>

      <div className="produit-infos">
        <div className="produit-pied">
          <span className="detail-prix">
            {String(prixAffiche).replace(".", ",")} €
          </span>
          {produit.stock !== undefined && produit.stock !== null && (
            <span
              className={`produit-stock ${
                produit.stock === 0
                  ? "produit-stock--rupture"
                  : produit.stock < 50
                    ? "produit-stock--bas"
                    : ""
              }`}
            >
              {formatStock(produit.stock)}
            </span>
          )}
        </div>

        {produit.origine && (
          <div className="produit-origine-boite">
            <span className="produit-origine-label">ORIGINE</span>
            <span className="produit-origine-valeur">{produit.origine}</span>
          </div>
        )}

        {afficherPoids && (
          <div className="produit-poids">
            <span className="produit-poids-label">QUANTITÉ</span>
            <div className="produit-poids-options">
              {poidsDisponibles.map((poids) => (
                <button
                  key={poids}
                  type="button"
                  className={`produit-poids-bouton ${selectedPoids === poids ? "produit-poids-bouton--actif" : ""}`}
                  onClick={() => setSelectedPoids(poids)}
                >
                  {poids}
                </button>
              ))}
            </div>
          </div>
        )}

        {!afficherPoids && (
          <div className="produit-poids">
            <span className="produit-poids-label">QUANTITÉ</span>
            <div className="produit-quantite">
              <button
                type="button"
                className="produit-quantite-bouton"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                −
              </button>
              <input
                className="produit-quantite-input"
                type="number"
                min="1"
                max={maxStock}
                value={quantityInput}
                onChange={(e) => {
                  const raw = e.target.value;
                  setQuantityInput(raw);
                  const val = parseInt(raw, 10);
                  if (!Number.isNaN(val) && val >= 1 && val <= maxStock) {
                    setQuantity(val);
                  }
                }}
                onBlur={() => {
                  const val = parseInt(quantityInput, 10);
                  if (Number.isNaN(val) || val < 1) {
                    setQuantity(1);
                    setQuantityInput("1");
                    return;
                  }
                  if (val > maxStock) {
                    setQuantity(maxStock);
                    setQuantityInput(String(maxStock));
                    return;
                  }
                  setQuantity(val);
                  setQuantityInput(String(val));
                }}
              />
              <button
                type="button"
                className="produit-quantite-bouton"
                onClick={increaseQuantity}
                disabled={quantity >= maxStock}
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="produit-actions--pile">
          <button
            type="button"
            className={`bouton bouton-principal ${isAdding ? "bouton-ajoute" : ""}`}
            onClick={handleAddToCart}
            disabled={produit.stock === 0}
          >
            {isAdding ? "Ajouté" : "Ajouter au panier"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
