import useFacture from "../hooks/UseFacture.jsx";

const FacturePage = ({ idCommande }) => {
  const { facture, loading, error, telechargerEtSauvegarder } =
    useFacture(idCommande);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p> Erreur de chargement {error}</p>;
  if (!facture) return null;

  return (
    <div>
      <h2>Facture N° {String(facture.NUMERO_FACTURE).padStart(6, "0")}</h2>
      <p>Date : {facture.DATE_FACTURE}</p>
      <p>Total TTC : {facture.MONTANT_TTC} €</p>

      {/* Au clic : génère le PDF, le télécharge ET le sauvegarde sur le serveur */}
      <button onClick={telechargerEtSauvegarder}>Télécharger ma facture</button>
    </div>
  );
};

export default FacturePage;
