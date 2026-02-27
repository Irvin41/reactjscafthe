import { useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import FactureDocument from "../components/FactureDocument";

const useFacture = (idCommande) => {
  const [facture, setFacture] = useState(null);
  const [lignes, setLignes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacture = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/facture/${idCommande}`,
        );
        const data = await res.json();
        setFacture(data.facture);
        setLignes(data.lignes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (idCommande) fetchFacture();
  }, [idCommande]);

  const telechargerEtSauvegarder = async () => {
    const html = renderToStaticMarkup(
      <FactureDocument facture={facture} lignes={lignes} />,
    );

    const res = await fetch("http://localhost:3001/api/facture/html-to-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html,
        css: facture,
        numeroFacture: facture.NUMERO_FACTURE,
      }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    URL.revokeObjectURL(url);
  };

  return { facture, lignes, loading, error, telechargerEtSauvegarder };
};

export default useFacture;
