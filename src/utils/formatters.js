export const formatText = (text) => {
  if (!text) return "";

  const categoryMap = {
    Cafe_grains: "Café en grains",
    Cafe_moulu: "Café moulu",
    The_noir: "Thé noir",
    The_vert: "Thé vert",
    The_blanc: "Thé blanc",
    The_Oolong: "Thé Oolong",
    Capsules: "Capsules",
    Infusion: "Infusions",
    Accessoire: "Accessoires",
    Coffret: "Coffrets",
  };

  if (categoryMap[text]) {
    return categoryMap[text];
  }

  // Sinon, formatage générique
  return text
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => {
      // Garder "et" et "en" en minuscule
      if (word.toLowerCase() === "et" || word.toLowerCase() === "en") {
        return word.toLowerCase();
      }
      // Première lettre en majuscule, reste en minuscule
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

export const formatPrice = (price) => {
  if (price === null || price === undefined) return "0,00 €";
  return `${Number(price).toFixed(2).replace(".", ",")} €`;
};
export const formatStock = (stock) => {
  if (stock === null || stock === undefined) return "Stock inconnu";
  if (stock === 0) return "Rupture de stock";
  if (stock < 50) return `Plus que ${stock} en stock`;
  return "En stock";
};
