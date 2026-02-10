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

    const id =
      product.id ??
      product.id_article ??
      product.sku ??
      product.slug ??
      product.nom_article ??
      product.name;

    const name =
      product.name ??
      product.nom_article ??
      product.nom_produit ??
      product.title ??
      "Produit";

    

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
    };
  };

  const addToCart = (product) => {
    const normalized = normalizeProduct(product);
    if (!normalized?.id) return;

    setCart((prevCart) => {
      const isProductInCart = prevCart.find(
        (item) => item.id === normalized.id,
      );
      if (isProductInCart) {
        return prevCart.map((item) =>
          item.id === normalized.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
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
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item,
      ),
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

export const useCart = () => useContext(CartContext);
