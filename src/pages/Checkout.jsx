import React, { useState, useContext, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { formatPrice } from "../utils/formatters";
import "../styles/Paiement.css";
import "../styles/Contact.css";
import { Link, useNavigate } from "react-router-dom";
import MondialRelayLoader from "../components/MondialRelay.jsx";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// ── Formulaire Carte Bancaire (Stripe) ──
const FormulaireCB = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/confirmation`,
      },
    });

    if (error) {
      setErreur(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-card section-paiement">
      <h2 className="sous-titre">PAIEMENT PAR CARTE</h2>
      <PaymentElement />
      {erreur && <p style={{ color: "red" }}>{erreur}</p>}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="bouton bouton-principal large"
        style={{ marginTop: "1rem" }}
      >
        {loading ? "Traitement..." : "CONFIRMER LE PAIEMENT"}
      </button>
    </form>
  );
};

// ── Formulaire PayPal ──
const FormulairePayPal = ({ montant, onSuccess, onError }) => {
  return (
    <div className="auth-card section-paiement">
      <h2 className="sous-titre">PAIEMENT PAYPAL</h2>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: montant.toFixed(2),
                  currency_code: "EUR",
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            onSuccess(details);
          });
        }}
        onError={(err) => {
          console.error("Erreur PayPal :", err);
          onError("Une erreur est survenue avec PayPal.");
        }}
      />
    </div>
  );
};

// ── Page Paiement ──
const Paiement = () => {
  const {
    cartDisplayed,
    cartTotal,
    palier,
    loyaltySavings,
    freeShipping,
    setShippingMethod,
    clearCart,
  } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [hasModified, setHasModified] = useState(false);
  const [profilCommande, setProfilCommande] = useState({});
  const [formData, setFormData] = useState({});
  const [modeLivraison, setModeLivraison] = useState("retrait");
  const [modePaiement, setModePaiement] = useState("Carte Bancaire");
  const [pointRelais, setPointRelais] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loadingPaiement, setLoadingPaiement] = useState(false);
  const [erreurPaiement, setErreurPaiement] = useState(null);

  const mappingLivraison = {
    mondial: "point_relais",
    chronopost: "domicile",
    colissimo: "domicile",
    retrait: "retrait",
  };

  const changerLivraison = (key) => {
    setModeLivraison(key);
    setShippingMethod(mappingLivraison[key] ?? key);
  };

  const idClient = user?.id_client || user?.id;
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!idClient) return;
    fetch(`${API}/api/client/${idClient}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur récupération profil");
        return res.json();
      })
      .then((data) => {
        const initialData = data.client || data || {};
        setProfilCommande(initialData);
        setFormData(initialData);
      })
      .catch((err) => console.error("Erreur API Paiement:", err));
  }, [idClient, API]);

  const calculFinancier = cartDisplayed.reduce(
    (acc, item) => {
      if (item.isSample) return acc;
      const tauxTVA = parseFloat(item.taux_tva) || 5.5;
      const prixTTC = parseFloat(item.finalPrice ?? item.prix_ttc ?? 0);
      const quantite = parseInt(item.quantity) || 0;
      const prixHT = prixTTC / (1 + tauxTVA / 100);
      const montantTVA = prixTTC - prixHT;
      if (tauxTVA === 20) {
        acc.tva20 += montantTVA * quantite;
      } else {
        acc.tva55 += montantTVA * quantite;
      }
      return acc;
    },
    { tva55: 0, tva20: 0 },
  );

  const handleSaveLocal = () => {
    setProfilCommande(formData);
    setEditing(false);
    setHasModified(true);
  };

  const handleCancelLocal = () => {
    setFormData(profilCommande);
    setEditing(false);
  };

  const handleChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (!hasModified) setHasModified(true);
  };

  // ── Articles formatés (réutilisé dans plusieurs handlers) ──
  const getArticles = () =>
    cartDisplayed
      .filter((item) => !item.isSample)
      .map((item) => ({
        id_article: item.id_article ?? String(item.id).split("_")[0],
        quantite: item.quantity,
        prix_ttc: item.finalPrice ?? item.price ?? item.prix_ttc,
        poids: item.poids ?? null,
      }));

  const getLivraisonState = () => ({
    mode: modeLivraison,
    adresse: formData,
    pointRelais: pointRelais ?? null,
  });

  // ── Handler : Paiement au comptoir & Stripe ──
  const handlePayer = async () => {
    setLoadingPaiement(true);
    setErreurPaiement(null);

    try {
      const articles = getArticles();

      if (modePaiement === "Paiement au comptoir") {
        const res = await fetch(`${API}/api/commandes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id_client: idClient, articles }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        clearCart();
        navigate("/confirmation", {
          state: {
            mode: "comptoir",
            commande: data.commande,
            articles: cartDisplayed
              .filter((i) => !i.isSample)
              .map((i) => ({
                nom_article: i.name ?? i.nom_article,
                poids: i.poids ?? null,
                quantite: i.quantity,
              })),
            livraison: getLivraisonState(),
          },
        });
        return;
      }

      // Stripe
      const res = await fetch(`${API}/api/commandes/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id_client: idClient, articles }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      sessionStorage.setItem(
        "livraison_confirmation",
        JSON.stringify(getLivraisonState()),
      );

      setClientSecret(data.clientSecret);
    } catch (err) {
      setErreurPaiement(err.message);
    } finally {
      setLoadingPaiement(false);
    }
  };

  // ── Handler : PayPal success ──
  const handlePaypalSuccess = async (details) => {
    setLoadingPaiement(true);
    setErreurPaiement(null);

    try {
      const articles = getArticles();

      const res = await fetch(`${API}/api/commandes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id_client: idClient,
          articles,
          paypal: true,
          paypal_order_id: details.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      clearCart();
      navigate("/confirmation", {
        state: {
          mode: "paypal",
          commande: data.commande,
          articles: cartDisplayed
            .filter((i) => !i.isSample)
            .map((i) => ({
              nom_article: i.name ?? i.nom_article,
              poids: i.poids ?? null,
              quantite: i.quantity,
            })),
          livraison: getLivraisonState(),
        },
      });
    } catch (err) {
      setErreurPaiement(err.message);
    } finally {
      setLoadingPaiement(false);
    }
  };

  const SEUIL_GRATUIT = 45;
  const obtenirFrais = () => {
    if (modeLivraison === "retrait") return 0;
    if (freeShipping) return 0;
    if (cartTotal >= SEUIL_GRATUIT) return 0;
    const frais = { chronopost: 12.9, colissimo: 8.9, mondial: 4.9 };
    return frais[modeLivraison] || 0;
  };

  const fraisPort = obtenirFrais();
  const totalFinal = cartTotal + fraisPort;
  const totalSansRemise = cartTotal + (loyaltySavings ?? 0);

  return (
    <main className="page etroit">
      <h1 className="titre centre">Votre commande</h1>

      {/* ── SECTION 1 : PANIER ── */}
      <section className="auth-card section-paiement">
        <h2 className="sous-titre">VOTRE PANIER</h2>
        <div className="corps-panier">
          {cartDisplayed.map((item, index) => {
            const itemKey = item.id ?? item.id_article ?? index;
            return (
              <div key={itemKey} className="panier-item">
                <span className="discret">
                  {item.isSample ? (
                    "Échantillons"
                  ) : (
                    <>
                      {item.quantity}x{" "}
                      {item.name ?? item.nom_article ?? item.nom}
                      {item.poids && <> — {item.poids}</>}
                    </>
                  )}
                </span>
                <span className="item-prix">
                  {item.isSample
                    ? "Gratuit"
                    : formatPrice(
                        (item.finalPrice ?? item.price) * item.quantity,
                      )}
                </span>
              </div>
            );
          })}

          <div className="recap-details">
            {calculFinancier.tva55 > 0 && (
              <div className="recap-final-tva">
                <span>TVA (5.5%)</span>
                <span>{formatPrice(calculFinancier.tva55)}</span>
              </div>
            )}
            {calculFinancier.tva20 > 0 && (
              <div className="recap-final-tva">
                <span>TVA (20%)</span>
                <span>{formatPrice(calculFinancier.tva20)}</span>
              </div>
            )}

            {palier && loyaltySavings > 0 && (
              <div
                className="recap-final-tva"
                style={{ color: "var(--color-green)", fontWeight: 600 }}
              >
                <span>Remise fidélité {palier.name}</span>
                <span>− {formatPrice(loyaltySavings)}</span>
              </div>
            )}

            <div className="total-final centre">
              <span>Total : </span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <p className="message-info-livraison centre">
              Livraison gratuite à partir de {formatPrice(SEUIL_GRATUIT)}.
            </p>
          </div>

          <div className="centre action-retour">
            <Link to="/shop" className="lien centre">
              Continuer vos achats
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 : COORDONNÉES ── */}
      <section className="auth-card section-paiement">
        <div className="entete-adresse">
          <h2 className="sous-titre">COORDONNÉES</h2>
          {!editing ? (
            <button
              type="button"
              className="lien"
              onClick={() => setEditing(true)}
            >
              MODIFIER
            </button>
          ) : (
            <div className="boutons-edition">
              <button
                type="button"
                className="lien dore"
                onClick={handleSaveLocal}
              >
                ENREGISTRER
              </button>
              <button
                type="button"
                className="lien annuler"
                onClick={handleCancelLocal}
              >
                ANNULER
              </button>
            </div>
          )}
        </div>

        <div className="auth-form une-colonne">
          <div className="grille-choix-adresse">
            <input
              readOnly={!editing}
              value={formData.prenom || ""}
              placeholder="Prénom"
              onChange={(e) => handleChange("prenom", e.target.value)}
            />
            <input
              readOnly={!editing}
              value={formData.nom || ""}
              placeholder="Nom"
              onChange={(e) => handleChange("nom", e.target.value)}
            />
          </div>
          <input
            readOnly={!editing}
            value={formData.adresse || ""}
            placeholder="Adresse (Rue)"
            onChange={(e) => handleChange("adresse", e.target.value)}
          />
          <div className="grille-choix-adresse">
            <input
              readOnly={!editing}
              value={formData.code_postal || ""}
              placeholder="Code Postal"
              onChange={(e) => handleChange("code_postal", e.target.value)}
            />
            <input
              readOnly={!editing}
              value={formData.ville || ""}
              placeholder="Ville"
              onChange={(e) => handleChange("ville", e.target.value)}
            />
          </div>
          {(editing || hasModified) && (
            <div className="checkbox-container">
              <input type="checkbox" id="privacy" required />
              <label htmlFor="privacy" className="auth-switch">
                J'accepte que mes données soient utilisées pour le traitement de
                ma demande conformément à la politique de confidentialité.
              </label>
              <p className="message-info-livraison">
                * Modifications uniquement pour cette commande.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 3 : LIVRAISON & PAIEMENT ── */}
      <section className="auth-card section-paiement">
        <h2 className="sous-titre">LIVRAISON & PAIEMENT</h2>
        <div className="grille-choix-paiement">
          <div className="colonne-choix">
            <h3 className="titre-choix">Paiement</h3>
            {["Paiement au comptoir", "Carte Bancaire", "Paypal"].map(
              (mode) => (
                <button
                  key={mode}
                  className={`bouton-choix ${modePaiement === mode ? "actif" : ""}`}
                  onClick={() => {
                    setModePaiement(mode);
                    setClientSecret(null);
                    setErreurPaiement(null);
                    if (mode === "Paiement au comptoir") {
                      changerLivraison("retrait");
                    }
                  }}
                >
                  <strong>{mode}</strong>
                </button>
              ),
            )}
          </div>

          <div className="colonne-choix">
            <h3 className="titre-choix">Livraison</h3>
            {[
              {
                key: "chronopost",
                label: "Chronopost",
                detail: "24-48h",
                prix: "12.90€",
              },
              {
                key: "colissimo",
                label: "Colissimo",
                detail: "3-5 jours",
                prix: "8.90€",
              },
              {
                key: "mondial",
                label: "Mondial Relay",
                detail: "48-72h",
                prix: "4.90€",
              },
              {
                key: "retrait",
                label: "Retrait magasin",
                detail: "24h",
                prix: "GRATUIT",
              },
            ].map(({ key, label, detail, prix }) => {
              const forcerRetrait =
                modePaiement === "Paiement au comptoir" && key !== "retrait";

              return (
                <button
                  key={key}
                  className={`bouton-choix ${modeLivraison === key ? "actif" : ""} ${forcerRetrait ? "disable" : ""}`}
                  onClick={() => !forcerRetrait && changerLivraison(key)}
                  disabled={forcerRetrait}
                >
                  <div className="info-transport">
                    <strong>{label}</strong>
                    <small>{detail}</small>
                  </div>
                  <span>{prix}</span>
                </button>
              );
            })}
          </div>
        </div>

        {modeLivraison === "mondial" && (
          <section>
            <MondialRelayLoader onSelect={(data) => setPointRelais(data)} />
          </section>
        )}

        <div className="zone-validation">
          <div className="recap-final-ligne">
            <span>Total panier</span>
            <span>{formatPrice(totalSansRemise)}</span>
          </div>

          {palier && loyaltySavings > 0 && (
            <div className="recap-final-ligne">
              <span className="remise-fidelite">
                Remise fidélité {palier.name}
              </span>
              <span className="remise-fidelite">
                − {formatPrice(loyaltySavings)}
              </span>
            </div>
          )}

          <div className="recap-final-ligne">
            <span className="remise-fidelite">Frais de port</span>
            <span className="remise-fidelite">
              {fraisPort === 0 ? "OFFERT" : formatPrice(fraisPort)}
            </span>
          </div>
          <div className="total-final">
            Total <small>avec ports</small> : {formatPrice(totalFinal)}
          </div>

          {erreurPaiement && <p style={{ color: "red" }}>{erreurPaiement}</p>}

          {/* Bouton principal — masqué si PayPal sélectionné ou si clientSecret Stripe présent */}
          {!clientSecret && modePaiement !== "Paypal" && (
            <button
              className="bouton bouton-principal large"
              onClick={handlePayer}
              disabled={loadingPaiement}
            >
              {loadingPaiement ? "Chargement..." : "PAYER MA COMMANDE"}
            </button>
          )}
        </div>

        {/* ── Stripe ── */}
        {clientSecret && modePaiement === "Carte Bancaire" && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <FormulaireCB />
          </Elements>
        )}

        {/* ── PayPal ── */}
        {modePaiement === "Paypal" && (
          <PayPalScriptProvider
            options={{
              "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
              currency: "EUR",
            }}
          >
            <FormulairePayPal
              montant={totalFinal}
              onSuccess={handlePaypalSuccess}
              onError={(msg) => setErreurPaiement(msg)}
            />
          </PayPalScriptProvider>
        )}
      </section>
    </main>
  );
};

export default Paiement;
