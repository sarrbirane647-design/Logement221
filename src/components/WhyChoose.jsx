import proprietaire from "../assets/images/proprietaire.jpg";

import { FaBolt, FaShieldHalved, FaMobileScreenButton } from "react-icons/fa6";

function WhyChoose() {
  return (
    <section className="why">

      <div className="why-content">

        <h2>Pourquoi choisir Logement221 ?</h2>

        <div className="why-grid">

          <div className="why-item">
            <div className="why-icon">
              <FaBolt />
            </div>
            <h3>Rapide</h3>
            <p>
              Trouvez rapidement le logement qui correspond à vos besoins.
            </p>
          </div>


          <div className="why-item">
            <div className="why-icon">
              <FaShieldHalved />
            </div>
            <h3>Sécurisé</h3>
            <p>
              Annonces vérifiées pour une location en toute confiance.
            </p>
          </div>


          <div className="why-item">
            <div className="why-icon">
              <FaMobileScreenButton />
            </div>
            <h3>Accessible</h3>
            <p>
              Plateforme disponible sur mobile, tablette et ordinateur.
            </p>
          </div>

        </div>

      </div>


<div className="owner-section">

  <div className="owner-content">

    <h3>Vous êtes propriétaire ?</h3>

    <p>
      Publiez votre annonce gratuitement et trouvez rapidement un locataire.
    </p>

    <button className="publish-btn">
      Publier une annonce
    </button>

  </div>

  <img
    src={proprietaire}
    alt="Propriétaire"
    className="owner-image"
  />

</div>

</section>
);
}

export default WhyChoose;