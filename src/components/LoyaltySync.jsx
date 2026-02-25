// src/components/LoyaltySync.jsx
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const LoyaltySync = () => {
  const { user } = useContext(AuthContext);
  const { setUserPoints } = useCart();

  useEffect(() => {
    console.log("user:", user);
    console.log("points_fidelite:", user?.points_fidelite);
    setUserPoints(user?.points_fidelite ?? 0);
  }, [user?.points_fidelite]);

  return null;
};

export default LoyaltySync;
