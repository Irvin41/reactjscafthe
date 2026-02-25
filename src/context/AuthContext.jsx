import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérification de la session
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

  // Login
  const login = async (userData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/client/me`,
        { credentials: "include" },
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data.client);
      } else {
        setUser(userData); // fallback si /me échoue
      }
    } catch {
      setUser(userData); // fallback si réseau
    }
  };

  // Logout
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
    window.dispatchEvent(new Event("auth:logout")); // vide le panier via CartContext
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user && !loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
