import React from "react";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/formatters";
import "../styles/CartDrawer.css";

const CartDrawer = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    isCartOpen,
    closeCart,
  } = useCart();
  const navigate = useNavigate();

  /**
   * Calcul de la synthèse financière (HT et TVA)
   * On utilise parseFloat pour transformer les chaînes SQL en nombres évitant ainsi le NaN
   */
  const calculFinancier = cart.reduce(
    (acc, item) => {
      // Dans votre BDD, vous avez prix_ht et taux_tva
      // Si vous stockez le prix TTC ajusté dans item.price :
      const prixTTCUnitaire = parseFloat(item.price) || 0;
      const tauxTVA = parseFloat(item.taux_tva) || 5.5; // Valeur par défaut 5.5%
      const quantite = parseInt(item.quantity) || 0;

      // Formule mathématique pour retrouver le HT à partir du TTC : HT = TTC / (1 + Taux)
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
      {/* Fond sombre qui ferme le panier au clic */}
      <div
        className={`cart-overlay ${isCartOpen ? "active" : ""}`}
        onClick={closeCart}
      ></div>

      {/* Le bandeau qui glisse de la droite */}
      <aside className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>Votre Sélection</h3>
          <button className="close-drawer" onClick={closeCart}>
            &times;
          </button>
        </div>

        <div className="drawer-content">
          {cart.length === 0 ? (
            <p className="empty-cart">Votre panier est vide.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="drawer-item">
                <div className="item-details">
                  <p className="item-name">{item.name}</p>
                  <p className="item-price">{formatPrice(item.price)}</p>
                  <div className="qty-picker">
                    <button onClick={() => updateQuantity(item.id, -1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  ❌
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="tax-summary">
              <div className="summary-line">
                <span>
                  Total Hors Taxes : {formatPrice(calculFinancier.totalHT)}
                </span>
              </div>
              <div className="summary-line">
                <span>Total TVA : {formatPrice(calculFinancier.totalTVA)}</span>
              </div>
            </div>

            <div className="total-box">
              <span>Total TTC</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => {
                closeCart();
                navigate("/checkout");
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
