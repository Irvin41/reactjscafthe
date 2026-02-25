import React, { useEffect, useState } from "react";

const MondialRelayLoader = ({ onSelect }) => {
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    // 1. Fonction pour charger les scripts un par un
    const loadScripts = async () => {
      // Charger jQuery
      const jq = document.createElement("script");
      jq.src = "https://code.jquery.com/jquery-3.6.0.min.js";
      document.head.appendChild(jq);

      jq.onload = () => {
        // Charger le Widget Mondial Relay une fois que jQuery est prêt
        const mr = document.createElement("script");
        mr.src =
          "https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js";
        document.head.appendChild(mr);

        mr.onload = () => {
          // Init du widget une fois le chargement terminé
          window.jQuery("#Zone_Widget").MR_ParcelShopPicker({
            Target: "#TParcelShopCode",
            Brand: "BDTEST  ",
            Country: "FR",
            PostCode: "41000",
            ColLivMod: "24R",
            Responsive: true,
            ShowResultOnMap: true,
            // On récupère le choix du locker dans le useState
            OnParcelShopSelected: (data) => {
              setSelection(data);
              if (onSelect) onSelect(data);
            },
          });
        };
      };
    };
    loadScripts(); // fonction pour charger les scripts un par un
  }, []);
  return (
    <div>
      <h2 className="sous-titre"> Où voulez-vous être livré ?</h2>

      {/* Zone d'affichage de la carte */}
      <div id="Zone_Widget"></div>

      {/* Affichage du résultat si un locker est choisi */}
      {selection && (
        <div>
          <h3 className="sous-titre">Locker sélectionné :</h3>
          <span className="Body centre">
            {selection.Nom} {selection.Adresse1} {selection.CP},{" "}
            {selection.Ville}
          </span>
        </div>
      )}
      {/* Champ invisible requis par le plugin pour fonctionner */}
      <input type="hidden" id="Target_Widget" />
    </div>
  );
};
export default MondialRelayLoader;
