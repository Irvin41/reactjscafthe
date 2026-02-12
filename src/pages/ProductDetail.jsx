import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatText, formatStock } from "../utils/formatters";
import "../styles/Productdetail.css";

// ── Catégories avec sélecteur de poids ──────────────────────────────
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
  if (categorie.startsWith("Cafe")) return ["100g", "200g", "250g", "500g"];
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

const ProductDetail = () => {
  const { id } = useParams();
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState("1");
  const [selectedPoids, setSelectedPoids] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/articles/${id}`,
        );
        if (!response.ok) {
          if (response.status === 404) throw new Error("Produit non trouvé");
          throw new Error("Erreur lors du chargement du produit");
        }
        const data = await response.json();
        setProduit(data.article);
        const poids = getPoidsByCategorie(data.article?.categorie);
        if (poids.length > 0) {
          const base = getPoidsBase(data.article?.categorie);
          setSelectedPoids(
            poids.find((p) => poidsEnGrammes(p) === base) || poids[0],
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!produit) return;
    setIsAdding(true);
    const prixCalcule = afficherPoids
      ? calculerPrix(produit.prix_ttc, produit.categorie, selectedPoids)
      : produit.prix_ttc;
    for (let i = 0; i < quantity; i++) {
      addToCart({ ...produit, poids: selectedPoids, prix_ttc: prixCalcule });
    }
    setTimeout(() => setIsAdding(false), 1000);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setQuantityInput(String(quantity - 1));
    }
  };
  const increaseQuantity = () => {
    if (produit && quantity < produit.stock) {
      setQuantity(quantity + 1);
      setQuantityInput(String(quantity + 1));
    }
  };

  if (loading) {
    return (
      <div className="pd-page">
        <div className="pd-spinner-wrap">
          <div className="pd-spinner" />
        </div>
      </div>
    );
  }

  if (error || !produit) {
    return (
      <div className="pd-page">
        <div className="pd-error">
          <p>{error || "Produit non trouvé"}</p>
          <Link to="/produits" className="pd-btn-back">
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = produit.image
    ? `${import.meta.env.VITE_API_URL}/images/${produit.image}`
    : "https://placehold.co/600x600?text=Image+non+disponible";

  const afficherPoids = isCafeThe(produit.categorie);
  const poidsDisponibles = getPoidsByCategorie(produit.categorie);
  const prixAffiche = afficherPoids
    ? calculerPrix(produit.prix_ttc, produit.categorie, selectedPoids)
    : Number(produit.prix_ttc).toFixed(2);

  return (
    <div className="pd-page">
      <div className="pd-wrapper">
        {/* ── Bloc principal ── */}
        <div className="pd-container">
          {/* ── Colonne gauche : image ── */}
          <div className="pd-col-left">
            <div className="pd-image-wrap">
              {produit.categorie && (
                <div className="pd-badge">{formatText(produit.categorie)}</div>
              )}
              <img
                src={imageUrl}
                alt={produit.nom_article}
                className="pd-image"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/600x600?text=Image+non+disponible";
                }}
              />
            </div>
          </div>

          {/* ── Colonne droite : infos ── */}
          <div className="pd-col-right">
            <h1 className="pd-title">{produit.nom_article}</h1>

            <div className="pd-price-row">
              <span className="pd-price">
                {String(prixAffiche).replace(".", ",")} €
              </span>
              {produit.stock !== undefined && produit.stock !== null && (
                <span
                  className={`pd-stock ${
                    produit.stock === 0
                      ? "pd-stock--out"
                      : produit.stock < 50
                        ? "pd-stock--low"
                        : ""
                  }`}
                >
                  {formatStock(produit.stock)}
                </span>
              )}
            </div>

            {produit.description && (
              <p className="pd-description">{produit.description}</p>
            )}

            {produit.origine && (
              <div className="pd-origin">
                <span className="pd-origin-label">ORIGINE</span>
                <span className="pd-origin-value">
                  {produit.origine.split(",")[0]}
                </span>
              </div>
            )}

            {/* ── Sélecteur poids (café/thé) ── */}
            {afficherPoids && (
              <div className="pd-poids-selector">
                <span className="pd-poids-label">QUANTITÉ</span>
                <div className="pd-poids-row">
                  <div className="pd-poids-options">
                    {poidsDisponibles.map((poids) => (
                      <button
                        key={poids}
                        className={`pd-poids-btn ${selectedPoids === poids ? "pd-poids-btn--active" : ""}`}
                        onClick={() => setSelectedPoids(poids)}
                      >
                        {poids}
                      </button>
                    ))}
                  </div>
                  <button
                    className={`pd-cart-btn ${isAdding ? "pd-cart-btn--added" : ""}`}
                    onClick={handleAddToCart}
                    disabled={isAdding || produit.stock === 0}
                  >
                    {isAdding ? (
                      <>
                        <i className="bi bi-check-lg" /> AJOUTÉ AU PANIER
                      </>
                    ) : (
                      "AJOUTER AU PANIER"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── Sélecteur quantité (capsules/accessoires) ── */}
            {!afficherPoids && (
              <div className="pd-qty-row">
                <div className="pd-qty-selector">
                  <button
                    className="pd-qty-btn"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    className="pd-qty-input"
                    type="number"
                    min="1"
                    value={quantityInput}
                    onChange={(e) => {
                      setQuantityInput(e.target.value);
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 1) {
                        setQuantity(val);
                      }
                    }}
                    onBlur={() => {
                      // Quand on quitte le champ : si vide ou invalide → remet 1
                      const val = parseInt(quantityInput, 10);
                      if (isNaN(val) || val < 1) {
                        setQuantity(1);
                        setQuantityInput("1");
                      } else {
                        setQuantityInput(String(val));
                      }
                    }}
                  />
                  <button
                    className="pd-qty-btn"
                    onClick={increaseQuantity}
                    disabled={!produit.stock || quantity >= produit.stock}
                  >
                    +
                  </button>
                </div>
                <button
                  className={`pd-cart-btn ${isAdding ? "pd-cart-btn--added" : ""}`}
                  onClick={handleAddToCart}
                  disabled={isAdding || produit.stock === 0}
                >
                  {isAdding ? (
                    <>
                      <i className="bi bi-check-lg" /> AJOUTÉ AU PANIER
                    </>
                  ) : (
                    "AJOUTER AU PANIER"
                  )}
                </button>
              </div>
            )}

            {/* ── Livraison ── */}
            <div className="pd-delivery">
              <i className="bi bi-truck pd-delivery-icon" />
              <div>
                <p className="pd-delivery-title">LIVRAISON OFFERTE</p>
                <p className="pd-delivery-sub">Dès 45€ d'achat</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Description détaillée ── */}
        {produit.description_detaillee && (
          <div className="pd-detail-section">
            <div className="pd-detail-card">
              <h3 className="pd-detail-title">
                <i className="bi bi-info-circle" />
                Description détaillée
              </h3>
              <div className="pd-detail-content">
                {produit.description_detaillee
                  .split("\n")
                  .map((line, index) => {
                    if (
                      line.match(
                        /^(Notes de dégustation|Profil aromatique|Intensité|Altitude|Traitement|Température|Infusion|Force|Méthode|Grade|Particularité|Bienfaits|Capacité|Matériau|Entretien|Certifications|Impact|Contenu|Origine|Usage|Oxydation|Forme|Cueillette|Sans théine|Suggestion|Épices|Service|Public|Inclus|Niveau|Valeur|Récolte|Caféine|Volume|Composition|Accord|Préparation|Crème|Mouture|Temps d'infusion|Filtre|Design|Chaînette|Diamètre|Style|Meule|Réglages|Corps|Avantage|Contenance|Verre|Piston|Utilisation|Précision|Portée max|Fonctions|Alimentation|Surface|Valve|Joint|Coffret|Polyvalence):/i,
                      )
                    ) {
                      return (
                        <p key={index} className="pd-detail-heading">
                          {line}
                        </p>
                      );
                    }
                    if (line.trim() === "")
                      return <div key={index} className="pd-detail-spacer" />;
                    return (
                      <p key={index} className="pd-detail-text">
                        {line}
                      </p>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
