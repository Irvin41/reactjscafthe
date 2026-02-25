import React from "react";

const MentionsLegalesPage = () => {
  return (
    <main className="page contenu">
      <header>
        <h1 className="titre">Mentions Légales</h1>
        <p className="texte centre">
          Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004
          pour la Confiance dans l'Économie Numérique (LCEN), les informations
          légales relatives au site de <strong className="vert">CafThé</strong>{" "}
          sont présentées ci-dessous.
        </p>
      </header>

      {/* Section 1 */}
      <section className="bloc">
        <h2 className="sous-titre">1. Éditeur du site</h2>
        <p className="texte">
          Le site e-commerce CafThé est édité par la société{" "}
          <strong className="vert">CafThé</strong>, dont les informations sont
          les suivantes :
        </p>
        <ul>
          <li>
            <strong className="vert">Raison sociale :</strong> CafThé
          </li>
          <li>
            <strong className="vert">Forme juridique :</strong> [À compléter –
            ex. SAS, SARL, auto-entrepreneur…]
          </li>
          <li>
            <strong className="vert">Capital social :</strong> [À compléter]
          </li>
          <li>
            <strong className="vert">Siège social :</strong> [Adresse complète à
            compléter]
          </li>
          <li>
            <strong className="vert">SIRET :</strong> [Numéro SIRET à compléter]
          </li>
          <li>
            <strong className="vert">RCS :</strong> [Ville d'immatriculation et
            numéro à compléter]
          </li>
          <li>
            <strong className="vert">Numéro de TVA intracommunautaire :</strong>{" "}
            [À compléter]
          </li>
          <li>
            <strong className="vert">Téléphone :</strong> [Numéro à compléter]
          </li>
          <li>
            <strong className="vert">E-mail :</strong> [Adresse e-mail à
            compléter]
          </li>
        </ul>
      </section>

      {/* Section 2 */}
      <section className="bloc">
        <h2 className="sous-titre">2. Directeur de la publication</h2>
        <p className="texte">
          Le directeur de la publication est{" "}
          <strong className="vert">[Nom et Prénom à compléter]</strong>, en
          qualité de représentant légal de la société CafThé.
        </p>
      </section>

      {/* Section 3 */}
      <section className="bloc">
        <h2 className="sous-titre">3. Hébergement</h2>
        <p className="texte">
          Le site CafThé est hébergé sur un serveur{" "}
          <strong className="vert">VPS (Plesk du campus)</strong>. Pour toute
          question relative à l'hébergement, les coordonnées de l'hébergeur sont
          les suivantes :
        </p>
        <ul>
          <li>
            <strong className="vert">Hébergeur :</strong> [Nom de l'hébergeur à
            compléter]
          </li>
          <li>
            <strong className="vert">Adresse :</strong> [Adresse de l'hébergeur
            à compléter]
          </li>
          <li>
            <strong className="vert">Site web :</strong> [URL à compléter]
          </li>
        </ul>
      </section>

      {/* Section 4 */}
      <section className="bloc">
        <h2 className="sous-titre">4. Propriété intellectuelle</h2>
        <p className="texte">
          L'ensemble des éléments constituant le site CafThé — textes, images,
          logos, graphismes, charte graphique, structure et tout autre contenu —
          est la propriété exclusive de <strong className="vert">CafThé</strong>{" "}
          ou de ses partenaires, et est protégé par les lois françaises et
          internationales relatives au droit d'auteur et à la propriété
          intellectuelle.
        </p>
        <p className="texte">
          Toute reproduction, distribution, modification ou exploitation, même
          partielle, de ces éléments sans autorisation écrite préalable de
          CafThé est strictement interdite et constitue une contrefaçon
          sanctionnée par le Code de la propriété intellectuelle.
        </p>
      </section>

      {/* Section 5 */}
      <section className="bloc">
        <h2 className="sous-titre">
          5. Protection des données personnelles (RGPD)
        </h2>
        <p className="texte">
          CafThé accorde une importance primordiale à la protection de vos
          données personnelles, conformément au{" "}
          <strong className="vert">
            Règlement Général sur la Protection des Données (RGPD)
          </strong>{" "}
          du 27 avril 2016 et à la loi Informatique et Libertés modifiée.
        </p>
        <p className="texte">
          Les données collectées lors de la création d'un compte client, du
          passage d'une commande ou de la navigation sur le site sont utilisées
          uniquement dans le cadre de la relation commerciale et du service
          client. Elles ne sont jamais cédées à des tiers à des fins
          commerciales.
        </p>
        <p className="texte">
          Conformément à la réglementation en vigueur, vous disposez des droits
          suivants sur vos données :
        </p>
        <ul>
          <li>
            <strong className="vert">Droit d'accès :</strong> consulter les
            données que nous détenons vous concernant.
          </li>
          <li>
            <strong className="vert">Droit de rectification :</strong> corriger
            des données inexactes ou incomplètes.
          </li>
          <li>
            <strong className="vert">Droit à l'effacement :</strong> demander la
            suppression de vos données (« droit à l'oubli »).
          </li>
          <li>
            <strong className="vert">Droit à la portabilité :</strong> recevoir
            vos données dans un format structuré et lisible.
          </li>
          <li>
            <strong className="vert">Droit d'opposition :</strong> vous opposer
            au traitement de vos données à des fins de prospection.
          </li>
        </ul>
        <p className="texte">
          Pour exercer ces droits, vous pouvez contacter CafThé à l'adresse
          e-mail indiquée à l'article 1 des présentes mentions légales. En cas
          de réclamation non résolue, vous pouvez introduire une plainte auprès
          de la <strong className="vert">CNIL</strong> (Commission Nationale de
          l'Informatique et des Libertés) sur le site{" "}
          <strong className="vert">www.cnil.fr</strong>.
        </p>
      </section>

      {/* Section 6 */}
      <section className="bloc">
        <h2 className="sous-titre">6. Cookies</h2>
        <p className="texte">
          Le site CafThé est susceptible d'utiliser des cookies afin d'améliorer
          votre expérience de navigation, mémoriser vos préférences et analyser
          l'audience du site. Un cookie est un petit fichier texte déposé sur
          votre terminal lors de votre visite.
        </p>
        <p className="texte">
          Conformément à la réglementation CNIL, votre consentement est
          recueilli avant tout dépôt de cookies non essentiels. Vous pouvez à
          tout moment modifier vos préférences via votre navigateur ou le
          gestionnaire de cookies disponible sur le site.
        </p>
      </section>

      {/* Section 7 */}
      <section className="bloc">
        <h2 className="sous-titre">7. Sécurité</h2>
        <p className="texte">
          Le site CafThé met en œuvre les mesures techniques nécessaires pour
          garantir la sécurité de vos données :
        </p>
        <ul>
          <li>
            <strong className="vert">Chiffrement HTTPS :</strong> toutes les
            communications entre votre navigateur et nos serveurs sont
            chiffrées.
          </li>
          <li>
            <strong className="vert">Hachage des mots de passe :</strong> vos
            mots de passe ne sont jamais stockés en clair (algorithme bcrypt).
          </li>
          <li>
            <strong className="vert">Authentification sécurisée :</strong>{" "}
            utilisation de tokens JWT pour sécuriser les échanges avec notre
            API.
          </li>
          <li>
            <strong className="vert">Protection active :</strong> nos systèmes
            sont protégés contre les injections SQL et les attaques XSS.
          </li>
        </ul>
      </section>

      {/* Section 8 */}
      <section className="bloc">
        <h2 className="sous-titre">8. Liens hypertextes</h2>
        <p className="texte">
          Le site CafThé peut contenir des liens vers des sites tiers. Ces liens
          sont fournis à titre informatif uniquement. CafThé ne saurait être
          tenu responsable du contenu de ces sites externes ni des pratiques de
          confidentialité qui y sont appliquées.
        </p>
        <p className="texte">
          Toute création de lien hypertexte pointant vers le site CafThé est
          soumise à autorisation préalable écrite de CafThé.
        </p>
      </section>

      {/* Section 9 */}
      <section className="bloc">
        <h2 className="sous-titre">9. Droit applicable</h2>
        <p className="texte">
          Les présentes mentions légales sont régies par le{" "}
          <strong className="vert">droit français</strong>. En cas de litige
          relatif à l'interprétation ou à l'exécution de ces mentions, et à
          défaut d'accord amiable, les tribunaux français compétents seront
          saisis.
        </p>
      </section>

      {/* Section 10 */}
      <section className="bloc">
        <h2 className="sous-titre">10. Mise à jour des mentions légales</h2>
        <p className="texte">
          CafThé se réserve le droit de modifier les présentes mentions légales
          à tout moment, notamment pour se conformer à toute nouvelle
          disposition légale ou réglementaire. La date de dernière mise à jour
          est indiquée en bas de cette page.
        </p>
        <p className="texte centre">
          <strong className="vert">Dernière mise à jour :</strong> Février 2026
        </p>
      </section>
    </main>
  );
};

export default MentionsLegalesPage;
