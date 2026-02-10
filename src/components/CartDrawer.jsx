import React from "react";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

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

  return (
    <>
      {/* Fond sombre qui ferme le panier au clic */}
      <div
        className={`cart-overlay ${isCartOpen ? "active" : ""}`}
        onClick={closeCart}
      ></div>

      {/* Le bandeau qui glisse de la gauche */}
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
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
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
