import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifie si un cookie de session valide existe
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/client/me`,
          {
            credentials: "include",
          },
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

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Tente l'appel API (ignore les erreurs 404)
      await fetch(`${import.meta.env.VITE_API_URL}/api/client/logout`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {
        // Ignore les erreurs (endpoint manquant)
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }

    // Nettoie TOUJOURS côté client
    setUser(null);
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
