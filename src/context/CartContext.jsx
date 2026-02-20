import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

const CartContext = createContext();
const API = import.meta.env.VITE_API_URL;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // ── Référence pour le timer de debounce ──────────────────────────────
  const saveTimer = useRef(null);

  // ── Sauvegarde localStorage ──────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ── Sauvegarde serveur (debounce 800ms) ──────────────────────────────
  // On ne sauvegarde que si l'utilisateur est connecté (cookie présent).
  // Si la requête renvoie 401/403, on ignore silencieusement.
  const saveCartToServer = useCallback((items) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/cart/save`, {
          method: "POST",
          credentials: "include", // envoie le cookie JWT
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItems: items }),
        });

        // 401 / 403 = non connecté → pas une erreur à signaler
        if (!res.ok && res.status !== 401 && res.status !== 403) {
          console.warn("Sauvegarde panier échouée :", res.status);
        }
      } catch (err) {
        // Pas de connexion réseau, on ignore
        console.warn("Sauvegarde panier : pas de réseau", err.message);
      }
    }, 800);
  }, []);

  // ── Normalisation produit ────────────────────────────────────────────
  const normalizeProduct = (product) => {
    if (!product) return null;

    const id =
      product.id_article ??
      product.id ??
      product.sku ??
      product.slug ??
      product.nom_article;

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

  // ── Ajout au panier ──────────────────────────────────────────────────
  const addToCart = (product) => {
    const normalized = normalizeProduct(product);
    if (!normalized?.id) return;

    if (normalized.stock !== null && normalized.stock <= 0) {
      console.warn("Produit en rupture de stock");
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === normalized.id);
      let newCart;

      if (existing) {
        const newQuantity = existing.quantity + 1;
        if (normalized.stock !== null && newQuantity > normalized.stock) {
          console.warn("Stock insuffisant");
          return prevCart;
        }
        newCart = prevCart.map((item) =>
          item.id === normalized.id ? { ...item, quantity: newQuantity } : item,
        );
      } else {
        newCart = [...prevCart, { ...normalized, quantity: 1 }];
      }

      saveCartToServer(newCart); // ← sauvegarde après chaque ajout
      return newCart;
    });

    setIsCartOpen(true);
  };

  // ── Suppression ──────────────────────────────────────────────────────
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId);
      saveCartToServer(newCart); // ← sauvegarde après suppression
      return newCart;
    });
  };

  // ── Mise à jour quantité ─────────────────────────────────────────────
  const updateQuantity = (productId, amount) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item) => {
        if (item.id !== productId) return item;

        const newQuantity = Math.max(1, item.quantity + amount);
        if (item.stock !== null && newQuantity > item.stock) {
          console.warn("Stock insuffisant");
          return item;
        }
        return { ...item, quantity: newQuantity };
      });

      saveCartToServer(newCart); // ← sauvegarde après mise à jour
      return newCart;
    });
  };

  // ── Vider le panier ──────────────────────────────────────────────────
  const clearCart = () => {
    setCart([]);
    saveCartToServer([]); // ← vide aussi côté serveur
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans un CartProvider");
  }
  return context;
};

export default useCart;
