import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
const API = import.meta.env.VITE_API_URL;

// ─── Config paliers fidélité
const paliers = [
  {
    name: "Bronze",
    min: 0,
    max: 300,
    discounts: {
      accessories: 0.05,
      all: null,
      freeShipping: null,
      samples: false,
    },
  },
  {
    name: "Argent",
    min: 301,
    max: 600,
    discounts: {
      accessories: 0.05,
      all: null,
      freeShipping: "point_relais",
      samples: true,
    },
  },
  {
    name: "Or",
    min: 601,
    max: Infinity,
    discounts: {
      accessories: null,
      all: 0.15,
      freeShipping: "all",
      samples: true,
    },
  },
];

// Utilitaires fidélité
export function getPalier(points) {
  return paliers.find((p) => points >= p.min && points <= p.max) || null;
}

function getDiscountedPrice(item, palier) {
  if (!palier) return item.price;
  const { all, accessories } = palier.discounts;
  if (all) return item.price * (1 - all);
  if (accessories && item.category === "accessoire")
    return item.price * (1 - accessories);
  return item.price;
}

function isFreeShipping(palier, shippingMethod) {
  if (!palier) return false;
  const { freeShipping } = palier.discounts;
  return freeShipping === "all" || freeShipping === shippingMethod;
}

function getSampleItem(palier) {
  if (!palier?.discounts.samples) return null;
  return {
    id: "sample-offert",
    name: "Échantillon offert",
    price: 0,
    originalPrice: 0,
    finalPrice: 0,
    category: "cadeau",
    quantity: 1,
    isSample: true,
  };
}

// ─── Provider ────────────────────────────────────────────────────────────────
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Points fidélité — à remplacer par ton store auth : setUserPoints(user.loyalty_points)
  const [userPoints, setUserPoints] = useState(0);
  const [shippingMethod, setShippingMethod] = useState("point_relais");

  // ── Sauvegarde localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const normalizeProduct = (product) => {
    if (!product) return null;

    const baseId =
      product.id_article ??
      product.id ??
      product.sku ??
      product.slug ??
      product.nom_article;

    // id unique par produit + poids
    const id = product.poids ? `${baseId}_${product.poids}` : baseId;

    const name =
      product.nom_article ??
      product.name ??
      product.nom_produit ??
      product.title ??
      "Produit";

    const price =
      product.prix_ttc ?? product.prix_ht ?? product.price ?? product.prix ?? 0;

    const stock = product.stock ?? null;

    const rawImage = product.image ?? product.imageUrl ?? null;
    const image =
      typeof rawImage === "string" && rawImage.length > 0
        ? rawImage.startsWith("http") ||
          rawImage.startsWith("/") ||
          rawImage.startsWith("data:")
          ? rawImage
          : `${API}/images/${rawImage}`
        : null;

    return { ...product, id, name, price, image, stock };
  };

  // ── Ajout au panier ─────────────────────────────────────────────────────
  const addToCart = (product) => {
    const normalized = normalizeProduct(product);
    if (!normalized?.id) return;

    if (normalized.stock !== null && normalized.stock <= 0) {
      console.warn("Produit en rupture de stock");
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === normalized.id);

      if (existing) {
        const newQuantity = existing.quantity + 1;
        if (normalized.stock !== null && newQuantity > normalized.stock) {
          console.warn("Stock insuffisant");
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === normalized.id ? { ...item, quantity: newQuantity } : item,
        );
      }

      return [...prevCart, { ...normalized, quantity: 1 }];
    });

    setIsCartOpen(true);
  };

  // ── Suppression
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // ── Mise à jour quantité
  const updateQuantity = (productId, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id !== productId) return item;
        const newQuantity = Math.max(1, item.quantity + amount);
        if (item.stock !== null && newQuantity > item.stock) {
          console.warn("Stock insuffisant");
          return item;
        }
        return { ...item, quantity: newQuantity };
      }),
    );
  };

  // ── Vider le panier
  const clearCart = () => setCart([]);

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const closeCart = () => setIsCartOpen(false);

  // ── Calculs fidélité
  const palier = getPalier(userPoints);

  const cartWithDiscounts = cart.map((item) => ({
    ...item,
    originalPrice: item.price,
    finalPrice: getDiscountedPrice(item, palier),
  }));

  const sample = getSampleItem(palier);
  const cartDisplayed = sample
    ? [...cartWithDiscounts, sample]
    : cartWithDiscounts;

  const cartTotal = cartWithDiscounts.reduce(
    (acc, item) => acc + item.finalPrice * item.quantity,
    0,
  );

  const loyaltySavings = cartWithDiscounts.reduce(
    (acc, item) => acc + (item.originalPrice - item.finalPrice) * item.quantity,
    0,
  );

  const freeShipping = isFreeShipping(palier, shippingMethod);

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        // Panier de base
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        isCartOpen,
        toggleCart,
        closeCart,
        // Panier avec réductions + échantillon
        cartDisplayed,
        cartTotal,
        // Fidélité
        palier,
        loyaltySavings,
        freeShipping,
        userPoints,
        setUserPoints,
        shippingMethod,
        setShippingMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart doit être utilisé dans un CartProvider");
  return context;
};

export default useCart;
