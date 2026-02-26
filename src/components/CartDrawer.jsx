import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/formatters";
import "../styles/CartDrawer.css";

const CartDrawer = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const {
    cartDisplayed,
    updateQuantity,
    removeFromCart,
    cartTotal,
    isCartOpen,
    closeCart,
    palier,
    loyaltySavings,
    freeShipping,
  } = useCart();

  const navigate = useNavigate();

  const calculFinancier = cartDisplayed.reduce(
    (acc, item) => {
      if (item.isSample) return acc;
      const prixTTCUnitaire = parseFloat(item.finalPrice) || 0;
      const tauxTVA = parseFloat(item.taux_tva) || 5.5;
      const quantite = parseInt(item.quantity) || 0;
      const prixHTUnitaire = prixTTCUnitaire / (1 + tauxTVA / 100);
      const montantTVAUnitaire = prixTTCUnitaire - prixHTUnitaire;
      acc.totalHT += prixHTUnitaire * quantite;
      acc.totalTVA += montantTVAUnitaire * quantite;
      return acc;
    },
    { totalHT: 0, totalTVA: 0 },
  );

  return (
    <>
      {/* Fond sombre */}
      <div
        className={`cart-overlay ${isCartOpen ? "active" : ""}`}
        onClick={closeCart}
      />

      {/* Tiroir */}
      <aside className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        {/* ── En-tête ── */}
        <div className="drawer-header">
          <h3>Votre Sélection</h3>
          <button className="close-drawer" onClick={closeCart}>
            &times;
          </button>
        </div>

        {/* ── Bannière fidélité — uniquement si connecté ── */}
        {isAuthenticated && palier && (
          <div
            className={`drawer-loyalty-banner palier-${palier.name.toLowerCase()}`}
          >
            <div>
              <p className="palier-nom">Offre fidélité : {palier.name}</p>
            </div>
          </div>
        )}

        {/* ── Contenu ── */}
        <div className="drawer-content">
          {cartDisplayed.length === 0 ? (
            <p className="empty-cart">Votre panier est vide.</p>
          ) : (
            cartDisplayed.map((item, index) => {
              const itemKey = item.id ?? item.id_article ?? index;

              return (
                <div key={itemKey} className="drawer-item">
                  <div className="item-details">
                    <p className="item-name">
                      {item.name ?? item.nom_article}
                      {item.poids && (
                        <>
                          {" "}
                          <span className="item-poids">{item.poids}</span>
                        </>
                      )}
                    </p>

                    <p className="item-price">
                      {item.isSample
                        ? "Gratuit"
                        : formatPrice(item.originalPrice ?? item.price)}
                    </p>

                    {/* Quantité — masquée pour l'échantillon */}
                    {!item.isSample && (
                      <div className="qty-picker">
                        <button onClick={() => updateQuantity(itemKey, -1)}>
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(itemKey, 1)}>
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Supprimer — masqué pour l'échantillon */}
                  {!item.isSample && (
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(itemKey)}
                    >
                      ❌
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer ── */}
        {cartDisplayed.length > 0 && (
          <div className="drawer-footer">
            <div className="tax-summary">
              <div className="summary-line">
                <span>Total Hors Taxes</span>
                <span>{formatPrice(calculFinancier.totalHT)}</span>
              </div>
              <div className="summary-line">
                <span>Total TVA</span>
                <span>{formatPrice(calculFinancier.totalTVA)}</span>
              </div>
              <div
                className="summary-line"
                style={{ color: "var(--color-badge-bg)", fontWeight: 600 }}
              >
                <span>Livraison</span>
                <span
                  style={{
                    color: freeShipping ? "var(--color-badge-bg)" : "inherit",
                  }}
                >
                  {freeShipping ? "Gratuite" : "Calculée à l'étape suivante"}
                </span>
              </div>
              {isAuthenticated && loyaltySavings > 0 && (
                <>
                  <div className="summary-line">
                    <span>Total avant remise</span>
                    <span>{formatPrice(cartTotal + loyaltySavings)}</span>
                  </div>
                  <div
                    className="summary-line"
                    style={{
                      color: "var(--color-badge-bg)",
                      fontWeight: 600,
                    }}
                  >
                    <span>Vous économisez</span>
                    <span>− {formatPrice(loyaltySavings)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="total-box">
              <span>Total TTC</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => {
                closeCart();
                navigate("/paiement");
              }}
            >
              Valider la commande
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
