import React, { createContext, useState, useEffect } from "react";
import { useCart } from "./CartContext.jsx";

// On exporte le contexte
export const AuthContext = createContext(null);

// On exporte le Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupération des outils du panier
  const { clearCart } = useCart();

  // Vérification de la session au montage
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/client/me`,
          { credentials: "include" },
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.client);
        }
      } catch (error) {
        console.error("Erreur vérification session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/client/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    }
    setUser(null);
    clearCart(); // Vide le panier localement
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user && !loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
