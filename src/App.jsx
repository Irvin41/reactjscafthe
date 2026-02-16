import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDetail from "./pages/ProductDetail.jsx";
import Login from "./pages/Login.jsx";
import Layout from "./layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Orders from "./pages/Orders";
import Cafes from "./pages/Cafes.jsx";
import Thes from "./pages/Thes.jsx";
import Accessoires from "./pages/Accessoires.jsx";
import Coffrets from "./pages/Coffrets.jsx";
import Recherche from "./pages/Recherche.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import Shop from "./components/Shop.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="produit/:id" element={<ProductDetail />} />
              <Route path="cafes" element={<Cafes />} />
              <Route path="thes" element={<Thes />} />
              <Route path="recherche" element={<Recherche />} />
              <Route path="accessoires" element={<Accessoires />} />
              <Route path="coffrets" element={<Coffrets />} />
              <Route path="login" element={<Login />} />
              <Route path="profile" element={<Profile />} />
              <Route path="commandes" element={<Orders />} />
              <Route path="a-propos" element={<AboutPage />} />
              <Route path="shop" element={<Shop />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
