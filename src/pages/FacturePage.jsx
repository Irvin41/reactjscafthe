import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";
import FactureDocument from "../components/FactureDocument";
import factureCSS from "../styles/Facture.css?raw";
import logoUrl from "../assets/logo.webp";

const API = import.meta.env.VITE_API_URL;

const toBase64 = (url) =>
  fetch(url)
    .then((r) => r.blob())
    .then(
      (blob) =>
        new Promise((res) => {
          const reader = new FileReader();
          reader.onloadend = () => res(reader.result);
          reader.readAsDataURL(blob);
        }),
    );

const FacturePage = () => {
  const { idCommande } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const genererPDF = async () => {
      try {
        // 1. Récupère les données de la facture
        const res = await fetch(`${API}/api/facture/${idCommande}`, {
          credentials: "include",
        });
        const data = await res.json();
        const { facture, lignes } = data;
        console.log(data);

        // 2. Convertit le logo en base64
        const logoBase64 = await toBase64(logoUrl);

        // 3. Génère le HTML depuis le composant React
        const html = renderToStaticMarkup(
          <FactureDocument
            facture={facture}
            lignes={lignes}
            logoBase64={logoBase64}
          />,
        );

        // 4. Envoie au backend pour générer le PDF
        const pdfRes = await fetch(`${API}/api/facture/html-to-pdf`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            html,
            css: factureCSS,
            numeroFacture: facture.NUMERO_FACTURE,
          }),
        });

        // 5. Affiche le PDF dans la page
        const blob = await pdfRes.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        setError(err.message);
      }
    };

    genererPDF();
  }, [idCommande]);

  if (error) return <p>Erreur : {error}</p>;
  if (!pdfUrl) return <p>Génération du PDF...</p>;

  return (
    <iframe
      src={pdfUrl}
      style={{ width: "100vw", height: "100vh", border: "none" }}
      title="Facture PDF"
    />
  );
};

export default FacturePage;
