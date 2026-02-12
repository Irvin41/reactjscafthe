import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDetail from "./pages/ProductDetail.jsx"; // ← CORRIGÉ : Un seul import, bon nom
import Login from "./pages/Login.jsx";
import Layout from "./layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Orders from "./pages/Orders";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Route parent : Layout contient navbar + outlet + footer */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              {/* Route pour le détail produit - UNE SEULE route */}
              <Route path="produit/:id" element={<ProductDetail />} />
              <Route path="login" element={<Login />} />
              <Route path="profile" element={<Profile />} />
              <Route path="/commandes" element={<Orders />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
