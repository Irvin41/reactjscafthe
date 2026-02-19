import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatText, formatStock } from "../utils/formatters";
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

const EXCLUDED_EXTRA_FIELDS = new Set([
  "id_article",
  "nom_article",
  "categorie",
  "description",
  "description_detaillee",
  "origine",
  "image",
  "prix_ht",
  "taux_tva",
  "prix_ttc",
  "stock",
]);

const formatFieldLabel = (key) =>
  key
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

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
      <div className="detail-page">
        <div className="detail-chargement">
          <div className="detail-spinner" />
        </div>
      </div>
    );
  }

  if (error || !produit) {
    return (
      <div className="detail-page centre">
        <div className="detail-erreur">
          <p>{error || "Produit non trouvé"}</p>
          <Link to="/produits" className="bouton bouton-principal">
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
  const infosSupplementaires = Object.entries(produit).filter(
    ([key, value]) => {
      if (EXCLUDED_EXTRA_FIELDS.has(key)) return false;
      if (value === null || value === undefined) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      if (typeof value === "object") return false;
      return true;
    },
  );

  return (
    <div className="detail-page">
      <div className="detail-wrapper contenu">
        {/* ── Bloc principal ── */}
        <div className="detail-carte">
          {/* ── Colonne gauche : image ── */}
          <div className="detail-col-gauche">
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
          </div>

          {/* ── Colonne droite : infos ── */}
          <div className="detail-col-droite">
            <h1>{produit.nom_article}</h1>

            <div className="detail-prix-ligne">
              <span className="produit-prix detail-prix">
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

            {produit.description && (
              <p className="texte discret">{produit.description}</p>
            )}

            {produit.origine && (
              <div className="detail-bloc-info">
                <span className="detail-label">ORIGINE</span>
                <span className="detail-valeur">{produit.origine}</span>
              </div>
            )}

            {infosSupplementaires.length > 0 && (
              <div className="detail-bloc-info detail-extras">
                <span className="detail-label">INFOS COMPLÉMENTAIRES</span>
                {infosSupplementaires.map(([key, value]) => (
                  <div key={key} className="detail-extra-ligne">
                    <span className="detail-extra-cle">
                      {formatFieldLabel(key)}:
                    </span>
                    <span className="detail-valeur">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ── Sélecteur poids (café/thé) ── */}
            {afficherPoids && (
              <div className="detail-selecteur">
                <span className="detail-label">QUANTITÉ</span>
                <div className="detail-selecteur-col">
                  <div className="detail-poids-options">
                    {poidsDisponibles.map((poids) => (
                      <button
                        key={poids}
                        className={`detail-poids-bouton ${selectedPoids === poids ? "detail-poids-bouton--actif" : ""}`}
                        onClick={() => setSelectedPoids(poids)}
                      >
                        {poids}
                      </button>
                    ))}
                  </div>
                  <button
                    className={`bouton bouton-principal ${isAdding ? "bouton-ajoute" : ""}`}
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
              <div className="detail-selecteur">
                <div className="detail-selecteur-col">
                  <div className="detail-quantite">
                    <button
                      className="detail-quantite-bouton"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      className="detail-quantite-input"
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
                      className="detail-quantite-bouton"
                      onClick={increaseQuantity}
                      disabled={!produit.stock || quantity >= produit.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={`bouton bouton-principal ${isAdding ? "bouton-ajoute" : ""}`}
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

            {/* ── Livraison ── */}
            <div className="detail-livraison">
              <i className="bi bi-truck detail-livraison-icone" />
              <div>
                <p className="detail-livraison-titre">LIVRAISON OFFERTE</p>
                <p className="discret">Dès 45€ d'achat</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Description détaillée ── */}
        {produit.description_detaillee && (
          <div className="detail-description-bloc">
            <div className="detail-description-carte">
              <h3 className="detail-description-titre">
                <i className="bi bi-info-circle" />
                Description détaillée
              </h3>
              <div className="detail-description-contenu">
                {produit.description_detaillee
                  .split("\n")
                  .map((line, index) => {
                    if (
                      line.match(
                        /^(Notes de dégustation|Profil aromatique|Intensité|Altitude|Traitement|Température|Infusion|Force|Méthode|Grade|Particularité|Bienfaits|Capacité|Matériau|Entretien|Certifications|Impact|Contenu|Origine|Usage|Oxydation|Forme|Cueillette|Sans théine|Suggestion|Épices|Service|Public|Inclus|Niveau|Valeur|Récolte|Caféine|Volume|Composition|Accord|Préparation|Crème|Mouture|Temps d'infusion|Filtre|Design|Chaînette|Diamètre|Style|Meule|Réglages|Corps|Avantage|Contenance|Verre|Piston|Utilisation|Précision|Portée max|Fonctions|Alimentation|Surface|Valve|Joint|Coffret|Polyvalence):/i,
                      )
                    ) {
                      return (
                        <p key={index} className="detail-description-entete">
                          {line}
                        </p>
                      );
                    }
                    if (line.trim() === "")
                      return (
                        <div
                          key={index}
                          className="detail-description-espace"
                        />
                      );
                    return (
                      <p key={index} className="texte">
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
