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
        // 1. Tente de récupérer la facture existante
        let res = await fetch(`${API}/api/facture/${idCommande}`, {
          credentials: "include",
        });

        // 2. Si elle n'existe pas encore, on la crée d'abord
        if (res.status === 404) {
          // Récupère les données de la commande pour calculer les montants
          const commandeRes = await fetch(`${API}/api/commande/${idCommande}`, {
            credentials: "include",
          });
          const commandeData = await commandeRes.json();
          const { commande } = commandeData;

          await fetch(`${API}/api/facture/`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_commande: idCommande,
              montantHT: commande.MONTANT_HT,
              montantTVA: commande.MONTANT_TVA,
              montantTTC: commande.MONTANT_TTC,
              modePaiement: commande.MODE_PAIEMENT,
            }),
          });

          // Re-fetch la facture fraîchement créée
          res = await fetch(`${API}/api/facture/${idCommande}`, {
            credentials: "include",
          });
        }

        if (!res.ok) {
          throw new Error(`Erreur serveur : ${res.status}`);
        }

        const data = await res.json();
        const { facture, lignes } = data;

        // 3. Convertit le logo en base64
        const logoBase64 = await toBase64(logoUrl);

        // 4. Génère le HTML depuis le composant React
        const bodyHtml = renderToStaticMarkup(
          <FactureDocument
            facture={facture}
            lignes={lignes}
            logoBase64={logoBase64}
          />,
        );

        // 5. Construit un document HTML
        const fullHtml = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Facture n°${String(facture.NUMERO_FACTURE).padStart(6, "0")}</title>
    <style>${factureCSS}</style>
  </head>
  <body>
    ${bodyHtml}
    <button class="btn-telecharger no-print" onclick="window.print()">
      Imprimer la facture
    </button>
    <script>
      window.addEventListener('load', () => window.print());
    </script>
  </body>
</html>`;

        const blob = new Blob([fullHtml], { type: "text/html" });
        setPdfUrl(URL.createObjectURL(blob));
      } catch (err) {
        setError(err.message);
      }
    };

    genererPDF();
  }, [idCommande]);

  if (error) return <p className="facture-erreur">Erreur : {error}</p>;
  if (!pdfUrl)
    return <p className="facture-chargement">Génération de la facture...</p>;

  return <iframe className="facture-iframe" src={pdfUrl} title="Facture PDF" />;
};

export default FacturePage;
