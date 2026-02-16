import React from "react";
import "../styles/AboutPage.css"; // Assure-toi que le fichier CSS est dans le même dossier

const AboutPage = () => {
  return (
    <main className="about-container">
      <header>
        <h1>À Propos de CafThé</h1>
        <p>
          Expertise dans la sélection de produits d'exception provenant des
          meilleurs terroirs mondiaux.
        </p>
      </header>

      <section>
        <h2>Notre Histoire</h2>
        <p>
          <strong>CafThé</strong> est né d'une idée simple : partager notre
          passion pour les bons produits en sélectionnant des thés et des cafés
          d'exception qui viennent des quatre coins du monde. Depuis le début,
          nous sommes reconnus pour notre savoir-faire et notre sérieux dans le
          choix de produits haut de gamme.
        </p>
        <p>
          Tout a commencé dans notre <strong>boutique physique</strong>, où nous
          aimons conseiller nos clients et partager nos secrets d'experts.
          Aujourd'hui, pour mieux vous servir, nous lançons notre site internet
          afin de vous proposer la même expérience, que vous soyez en magasin ou
          chez vous.
        </p>
        <p>
          Pour nous, la qualité ne va pas sans le respect de la nature. C'est
          pourquoi nous choisissons en priorité des produits issus de l'
          <strong>agriculture durable</strong> et du{" "}
          <strong>commerce équitable</strong>. Notre but est simple : vous
          offrir le meilleur du thé et du café tout en restant transparents sur
          leur origine.
        </p>
      </section>

      <section>
        <h2>Notre Expertise</h2>
        <ul>
          <li>
            <strong>Sélection rigoureuse :</strong> Produits issus de
            l'agriculture durable et du commerce équitable.
          </li>
          <li>
            <strong>Gamme diversifiée :</strong> Nous proposons des thés en
            vrac, des cafés en grains, ainsi que des accessoires spécialisés et
            des coffrets cadeaux.
          </li>
          <li>
            <strong>Conseils d'experts :</strong> Une expérience client
            personnalisée issue de notre savoir-faire en boutique physique.
          </li>
        </ul>
      </section>

      <section>
        <h2>Nos Valeurs Fondamentales</h2>
        <p>L'identité de CafThé repose sur quatre piliers essentiels :</p>
        <ul>
          <li>Qualité</li>
          <li>Durabilité</li>
          <li>Transparence</li>
          <li>Satisfaction client</li>
        </ul>
      </section>

      <section>
        <h2>Une Vision Moderne</h2>
        <p>
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
