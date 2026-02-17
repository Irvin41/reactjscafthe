import React from "react";

const AboutPage = () => {
  return (
    <main className="page">
      <header>
        <h1 className="titre">À Propos de CafThé</h1>
        <p className="texte centre">
          Expertise dans la sélection de produits d'exception provenant des
          meilleurs terroirs mondiaux.
        </p>
      </header>

      <section className="bloc">
        <h2 className="sous-titre">Notre Histoire</h2>
        <p className="texte">
          <strong className="vert">CafThé</strong> est né d'une idée simple :
          partager notre passion pour les bons produits en sélectionnant des
          thés et des cafés d'exception qui viennent des quatre coins du monde.
          Depuis le début, nous sommes reconnus pour notre savoir-faire et notre
          sérieux dans le choix de produits haut de gamme.
        </p>
        <p className="texte">
          Tout a commencé dans notre{" "}
          <strong className="vert">boutique physique</strong>, où nous aimons
          conseiller nos clients et partager nos secrets d'experts. Aujourd'hui,
          pour mieux vous servir, nous lançons notre site internet afin de vous
          proposer la même expérience, que vous soyez en magasin ou chez vous.
        </p>
        <p className="texte">
          Pour nous, la qualité ne va pas sans le respect de la nature. C'est
          pourquoi nous choisissons en priorité des produits issus de l'
          <strong className="vert">agriculture durable</strong> et du{" "}
          <strong className="vert">commerce équitable</strong>. Notre but est
          simple : vous offrir le meilleur du thé et du café tout en restant
          transparents sur leur origine.
        </p>
      </section>

      <section className="bloc">
        <h2 className="sous-titre">Notre Expertise</h2>
        <ul>
          <li>
            <strong className="vert">Sélection rigoureuse :</strong> Produits
            issus de l'agriculture durable et du commerce équitable.
          </li>
          <li>
            <strong className="vert">Gamme diversifiée :</strong> Nous proposons
            des thés en vrac, des cafés en grains, ainsi que des accessoires
            spécialisés et des coffrets cadeaux.
          </li>
          <li>
            <strong className="vert">Conseils d'experts :</strong> Une
            expérience client personnalisée issue de notre savoir-faire en
            boutique physique.
          </li>
        </ul>
      </section>

      <section className="bloc">
        <h2 className="sous-titre">Nos Valeurs Fondamentales</h2>
        <p className="texte">
          L'identité de CafThé repose sur quatre piliers essentiels :
        </p>
        <ul>
          <li>Qualité</li>
          <li>Durabilité</li>
          <li>Transparence</li>
          <li>Satisfaction client</li>
        </ul>
      </section>

      <section className="bloc">
        <h2 className="sous-titre">Une Vision Moderne</h2>
        <p className="texte">
          Pour répondre aux nouveaux usages, CafThé a entamé une transformation
          digitale. Notre objectif est d'offrir une expérience unifiée entre
          notre boutique et notre site e-commerce, tout en touchant une
          clientèle nationale.
        </p>
      </section>
    </main>
  );
};

export default AboutPage;
