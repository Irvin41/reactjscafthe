import React from "react";
import { Link } from "react-router-dom";

const CGVPage = () => {
  return (
    <main className="page contenu">
      <header>
        <h1 className="titre">Conditions Générales de Vente</h1>
        <p className="texte centre">
          Les présentes CGV régissent l'ensemble des ventes réalisées par{" "}
          <strong className="vert">CafThé</strong>, en boutique comme sur notre
          site e-commerce. Toute commande vaut acceptation pleine et entière de
          ces conditions.
        </p>
      </header>

      {/* Article 1 */}
      <section className="texte">
        <h2 className="sous-titre">Article 1 – Identification du vendeur</h2>
        <p className="texte">
          Le vendeur est la société <strong className="vert">CafThé</strong>,
          spécialisée dans la commercialisation de thés et cafés haut de gamme.
          Ses coordonnées complètes sont disponibles dans nos{" "}
          <Link className="lien-contact" to="/mentions-legales">
            Mentions Légales
          </Link>
          .
        </p>
        <h3 className="texte">
          CafThé propose ses produits via deux canaux de vente :
        </h3>
        <ul>
          <li>
            Sa boutique physique, ouverte aux horaires affichés en magasin ;
          </li>
          <li>
            Son site e-commerce, accessible 24h/24 et 7j/7 depuis n'importe quel
            navigateur récent.
          </li>
        </ul>
      </section>

      {/* Article 2 */}
      <section className="texte">
        <h2 className="sous-titre">Article 2 – Produits et disponibilité</h2>
        <p className="texte">
          CafThé commercialise des{" "}
          <strong className="vert">thés en vrac</strong>, des{" "}
          <strong className="vert">cafés en grains</strong>, des{" "}
          <strong className="vert">accessoires spécialisés</strong> et des{" "}
          <strong className="vert">coffrets cadeaux</strong>, tous issus d'une
          sélection rigoureuse selon nos critères de qualité, de durabilité et
          d'authenticité.
        </p>
        <p className="texte">
          Les disponibilités sont indiquées en temps réel sur les fiches produit
          du site. CafThé se réserve le droit de retirer un produit du catalogue
          à tout moment sans préavis. En cas d'indisponibilité après validation
          d'une commande, le client sera informé dans les plus brefs délais et
          pourra choisir entre un remboursement intégral ou un produit de
          remplacement équivalent.
        </p>
      </section>

      {/* Article 3 */}
      <section className="texte">
        <h2 className="sous-titre">Article 3 – Prix</h2>
        <p className="texte">
          Les prix affichés sur le site sont indiqués{" "}
          <strong className="vert">toutes taxes comprises (TTC)</strong>, en
          euros. Ils incluent la TVA applicable selon la catégorie du produit :
        </p>
        <ul>
          <li>
            <strong className="vert">5,5 %</strong> pour les thés et cafés ;
          </li>
          <li>
            <strong className="vert">20 %</strong> pour les accessoires et
            coffrets.
          </li>
        </ul>
        <p className="texte">
          Les frais de livraison, calculés selon le mode d'expédition choisi,
          sont indiqués séparément lors du processus de commande et récapitulés
          avant la validation du paiement. CafThé se réserve le droit de
          modifier ses tarifs à tout moment ; toutefois, les produits sont
          facturés au prix en vigueur au moment de la validation de la commande.
        </p>
      </section>

      {/* Article 4 */}
      <section className="texte">
        <h2 className="sous-titre">Article 4 – Commande</h2>
        <p className="texte">
          La passation d'une commande en ligne se déroule en quatre étapes :
        </p>
        <ul>
          <li>
            <strong className="vert">Identification :</strong> connexion à votre
            espace client ou création d'un compte rapide.
          </li>
          <li>
            <strong className="vert">Livraison :</strong> choix entre le retrait
            en boutique ou la livraison à domicile avec sélection du
            transporteur.
          </li>
          <li>
            <strong className="vert">Paiement :</strong> règlement sécurisé par
            carte bancaire, PayPal ou, en cas de retrait, paiement différé en
            magasin.
          </li>
          <li>
            <strong className="vert">Confirmation :</strong> récapitulatif
            complet et envoi automatique d'un e-mail de confirmation avec votre
            numéro de commande unique.
          </li>
        </ul>
        <p className="texte">
          Toute commande validée constitue un contrat de vente ferme entre le
          client et CafThé. CafThé se réserve le droit de refuser ou d'annuler
          toute commande suspecte ou non conforme aux présentes CGV.
        </p>
      </section>

      {/* Article 5 */}
      <section className="texte">
        <h2 className="sous-titre">Article 5 – Paiement</h2>
        <p className="texte">
          Le règlement s'effectue intégralement au moment de la validation de la
          commande en ligne. Les moyens de paiement acceptés sont :
        </p>
        <ul>
          <li>
            Carte bancaire (Visa, Mastercard) via une interface sécurisée ;
          </li>
          <li>PayPal ;</li>
          <li>
            Espèces, chèque ou carte bancaire en magasin (pour les achats en
            boutique ou le retrait de commandes en ligne).
          </li>
        </ul>
        <p className="texte">
          Toutes les transactions en ligne sont protégées par le protocole{" "}
          <strong className="vert">HTTPS</strong> et les données bancaires ne
          sont jamais stockées sur nos serveurs.
        </p>
      </section>

      {/* Article 6 */}
      <section className="texte">
        <h2 className="sous-titre">Article 6 – Livraison</h2>
        <p className="texte">
          CafThé livre actuellement en{" "}
          <strong className="vert">France Métropolitaine</strong> (Corse
          incluse). Plusieurs modes de livraison sont disponibles au moment de
          la commande : Colissimo, Chronopost Express, Mondial Relay et retrait
          en boutique. La livraison est offerte dès{" "}
          <strong className="vert">45,00 € TTC</strong> d'achat.
        </p>
        <p className="texte">
          Pour le détail complet des tarifs, délais et conditions d'expédition,
          consultez notre{" "}
          <Link className="lien-contact" to="/livraison">
            page Livraison
          </Link>
          .
        </p>
      </section>

      {/* Article 7 */}
      <section className="texte">
        <h2 className="sous-titre">Article 7 – Droit de rétractation</h2>
        <p className="texte">
          Conformément à la législation française en vigueur (articles L.221-18
          et suivants du Code de la consommation), le client dispose d'un délai
          de <strong className="vert">14 jours calendaires</strong> à compter de
          la réception de sa commande pour exercer son droit de rétractation,
          sans avoir à justifier de motif.
        </p>
        <p className="texte">
          Le remboursement est effectué dans un délai de{" "}
          <strong className="vert">14 jours</strong> suivant réception du
          retour, par le même moyen de paiement que celui utilisé lors de la
          commande. Le droit de rétractation ne s'applique pas aux produits
          alimentaires dont le sceau a été brisé après la livraison.
        </p>
        <p className="texte">
          Pour connaître l'ensemble des conditions et initier une procédure de
          retour, consultez notre{" "}
          <Link className="lien-contact" to="/retour">
            page Retours et Remboursements
          </Link>
          .
        </p>
      </section>

      {/* Article 8 */}
      <section className="texte">
        <h2 className="sous-titre">Article 8 – Garanties et réclamations</h2>
        <p className="texte">
          Tous les produits CafThé bénéficient de la{" "}
          <strong className="vert">garantie légale de conformité</strong>{" "}
          (articles L.217-4 et suivants du Code de la consommation) et de la{" "}
          <strong className="vert">garantie des vices cachés</strong> (articles
          1641 et suivants du Code civil).
        </p>
        <p className="texte">
          En cas de produit défectueux, endommagé ou non conforme à la commande,
          le client peut contacter notre service client via{" "}
          <Link className="lien-contact" to="/contact">
            notre formulaire en ligne
          </Link>{" "}
          en indiquant son numéro de commande. Nous nous engageons à proposer
          une solution adaptée dans les meilleurs délais (remboursement,
          échange, avoir).
        </p>
      </section>

      {/* Article 9 */}
      <section className="texte">
        <h2 className="sous-titre">Article 9 – Données personnelles</h2>
        <p className="texte">
          Les données collectées lors d'une commande sont nécessaires au
          traitement de celle-ci et sont traitées conformément au{" "}
          <strong className="vert">
            Règlement Général sur la Protection des Données (RGPD)
          </strong>
          . Elles ne sont jamais vendues à des tiers.
        </p>
        <p className="texte">
          Vous disposez d'un droit d'accès, de rectification, de suppression et
          de portabilité de vos données. Pour en savoir plus, consultez nos{" "}
          <Link className="lien-contact" to="/mentions-legales">
            Mentions Légales
          </Link>
          .
        </p>
      </section>

      {/* Article 10 */}
      <section className="texte">
        <h2 className="sous-titre">Article 10 – Droit applicable et litiges</h2>
        <p className="texte">
          Les présentes CGV sont soumises au{" "}
          <strong className="vert">droit français</strong>. En cas de litige, et
          à défaut de résolution amiable dans un délai de 30 jours, le client
          peut recourir gratuitement à un médiateur de la consommation
          conformément aux articles L.611-1 et suivants du Code de la
          consommation. À défaut d'accord amiable, tout litige relèvera de la
          compétence exclusive des tribunaux français compétents.
        </p>
      </section>
    </main>
  );
};

export default CGVPage;
