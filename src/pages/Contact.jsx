import React, { useState } from "react";
import "../styles/Contact.css";

const Contact = () => {
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Merci ! Votre message a été envoyé avec succès.");
  };

  return (
    <main className="page etroit">
      <header className="centre">
        <h1 className="titre">Nous contacter</h1>
        <p className="texte centre max-600">
          Vous avez des questions concernant une commande ? Vous désirez des
          informations sur nos produits ? Notre équipe est à votre écoute pour
          vous répondre dans les plus brefs délais.
        </p>
      </header>

      <section className="auth-card section-contact mt-gm">
        <form onSubmit={handleSubmit} className="auth-form une-colonne">
          {/* OBJET DU MESSAGE */}
          <div className="input-group">
            <label className="label-contact">Objet de votre demande *</label>
            <select name="subject" required className="contact-input">
              <option value="">Choisir un objet</option>
              <option value="service-client">Service Client</option>
              <option value="suivi-commande">Suivi de commande</option>
              <option value="qualite">Service Qualité</option>
              <option value="autre">Autre demande</option>
            </select>
          </div>

          {/* EMAIL */}
          <div className="input-group">
            <label className="label-contact">Adresse email *</label>
            <input
              type="email"
              name="email"
              placeholder="votre@email.com"
              required
              className="contact-input"
            />
          </div>

          {/* RÉFÉRENCE COMMANDE (OPTIONNEL) */}
          <div className="input-group">
            <label className="label-contact">
              Référence de commande (si concerné)
            </label>
            <input
              type="text"
              name="orderRef"
              placeholder="Ex: #12345"
              className="contact-input"
            />
          </div>

          {/* MESSAGE */}
          <div className="input-group">
            <label className="label-contact">Votre message *</label>
            <textarea
              name="message"
              rows="6"
              placeholder="Comment pouvons-nous vous aider ?"
              required
              className="contact-input textarea"
            ></textarea>
          </div>

          {/* CASE À COCHER CGU */}
          <div className="checkbox-container">
            <input type="checkbox" id="privacy" required />
            <label htmlFor="privacy" className="discret">
              J'accepte que mes données soient utilisées pour le traitement de
              ma demande conformément à la politique de confidentialité.
            </label>
          </div>

          {/* BOUTON ENVOYER */}
          <div className="centre mt-m">
            <button type="submit" className="bouton bouton-principal large">
              Envoyer le message
            </button>
          </div>

          {status && <p className="msg-success centre mt-m">{status}</p>}
        </form>
      </section>

      {/* RAPPEL SAV INFOS */}
      <section className="bloc centre mt-gm border-dark-top pt-m">
        <div className="sav-info">
          <h2 className="titre">Besoin d'une réponse immédiate ?</h2>
          <p className="centre">
            Notre service client est disponible par téléphone du lundi au
            vendredi de 9h à 18h.
          </p>
          <p className="total-final">01 23 45 67 89</p>
        </div>
      </section>
    </main>
  );
};

export default Contact;
