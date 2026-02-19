import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const normalizeProduct = (product) => {
    if (!product) return null;

    // ID: priorité à id_article (BDD), puis fallback
    const id =
      product.id_article ??
      product.id ??
      product.sku ??
      product.slug ??
      product.nom_article;

    // NOM: priorité à nom_article (BDD)
    const name =
      product.nom_article ??
      product.name ??
      product.nom_produit ??
      product.title ??
      "Produit";

    // PRIX: priorité à prix_ttc (BDD), puis prix_ht
    const price =
      product.prix_ttc ?? product.prix_ht ?? product.price ?? product.prix ?? 0;

    // STOCK (optionnel mais important pour la gestion)
    const stock = product.stock ?? null;

    // IMAGE: gestion du champ image de la BDD
    const rawImage = product.image ?? product.imageUrl ?? null;
    const image =
      typeof rawImage === "string" && rawImage.length > 0
        ? rawImage.startsWith("http") ||
          rawImage.startsWith("/") ||
          rawImage.startsWith("data:")
          ? rawImage
          : `${import.meta.env.VITE_API_URL}/images/${rawImage}`
        : null;

    return {
      ...product,
      id,
      name,
      price,
      image,
      stock,
    };
  };

  const addToCart = (product) => {
    const normalized = normalizeProduct(product);
    if (!normalized?.id) return;

    // Vérifier le stock disponible avant d'ajouter
    if (normalized.stock !== null && normalized.stock <= 0) {
      console.warn("Produit en rupture de stock");
      return;
    }

    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.id === normalized.id,
      );

      if (existingProduct) {
        // Vérifier si on peut augmenter la quantité
        const newQuantity = existingProduct.quantity + 1;
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

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + amount);

          // Vérifier le stock si disponible
          if (item.stock !== null && newQuantity > item.stock) {
            console.warn("Stock insuffisant");
            return item;
          }

          return { ...item, quantity: newQuantity };
        }
        return item;
      }),
    );
  };

  const clearCart = () => setCart([]);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const closeCart = () => setIsCartOpen(false);

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        itemCount,
        clearCart,
        isCartOpen,
        toggleCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Export nommé du hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans un CartProvider");
  }
  return context;
};

// Export par défaut du hook
export default useCart;
