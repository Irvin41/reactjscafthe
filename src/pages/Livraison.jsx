import React from "react";

const Livraison = () => {
  return (
    <main className="page">
      <header>
        <h1 className="titre">Modalités de Livraison</h1>
        <p className="texte centre">
          Cafthe s'engage à préparer vos commandes avec le plus grand soin pour
          préserver tous les arômes de vos thés et cafés jusqu'à votre domicile.
        </p>
      </header>

      <section className="bloc">
        <h2 className="sous-titre">Zones et Délais de Préparation</h2>
        <p className="texte">
          Nous livrons actuellement en{" "}
          <strong className="vert">France Métropolitaine</strong> (Corse
          incluse). Toute commande passée avant 12h est expédiée le jour même
          (hors week-end et jours fériés). Le délai de livraison court à partir
          de la remise de votre colis au transporteur.
        </p>
      </section>

      <section className="bloc">
        <h2 className="sous-titre">Nos Solutions de Transport</h2>
        <div className="texte">
          <p>
            Nous vous proposons quatre modes de livraison pour répondre à vos
            exigences :
          </p>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            <li style={{ marginBottom: "15px" }}>
              <strong className="vert">Colissimo Domicile (8,90 €) :</strong>
              Livraison sans signature sous 3 à 5 jours. En cas d'absence, votre
              colis est déposé dans votre boîte aux lettres ou au bureau de
              poste le plus proche.
            </li>
            <li style={{ marginBottom: "15px" }}>
              <strong className="vert">Chronopost Express (12,90 €) :</strong>
              La solution prioritaire pour une livraison le lendemain avant 13h
              (après expédition). Idéal pour ne jamais manquer de votre cru
              préféré.
            </li>
            <li style={{ marginBottom: "15px" }}>
              <strong className="vert">Mondial Relay (4,90 €) :</strong>
              Livraison économique sous 48h à 72h dans l'un des 12 000 points de
              retrait en France. Vous disposez de 8 jours pour retirer votre
              colis.
            </li>
            <li style={{ marginBottom: "15px" }}>
              <strong className="vert">Retrait en Boutique (Gratuit) :</strong>
              Disponible sous 24h dans notre établissement. Vous recevrez un
              e-mail dès que votre sélection est prête à être dégustée.
            </li>
          </ul>
        </div>
      </section>

      <section className="bloc">
        <h2 className="sous-titre">Frais de Port Offerts</h2>
        <p className="texte">
          Parce que la passion du goût ne devrait pas avoir de frontières,{" "}
          <strong className="vert">Cafthe vous offre la livraison</strong> dès
          que votre panier atteint <strong className="vert">45,00 € TTC</strong>
          .
        </p>
      </section>

      <section className="bloc">
        <h2 className="sous-titre">Suivi de Commande</h2>
        <p className="texte">
          Dès que votre colis quitte notre atelier, un{" "}
          <strong className="vert">numéro de suivi</strong> vous est communiqué
          par e-mail. Vous pouvez ainsi suivre chaque étape de l'acheminement de
          vos produits d'exception en temps réel depuis votre espace client.
        </p>
      </section>
    </main>
  );
};

export default Livraison;
