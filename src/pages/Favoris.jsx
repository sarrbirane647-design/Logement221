import { useContext } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { UserContext } from "../context/UserContext";

import { FaBed, FaBath } from "react-icons/fa";
import { FiMaximize2 } from "react-icons/fi";

function Favoris() {

  const { favorites } = useContext(UserContext);

  return (
    <>
      <Navbar />

      <section className="listings">

        <div className="listings-header">
          <h2>❤️ Mes favoris</h2>
        </div>

        {favorites.length === 0 ? (

          <p className="no-properties">
            Vous n'avez aucun favori.
          </p>

        ) : (

          <div className="listings-grid">

            {favorites.map((property) => (

              <div
                className="listing-card"
                key={property.firebaseId}
              >

                <div
                  className="listing-image"
                  style={{
                    backgroundImage: `url(${property.images?.[0] || property.image})`
                  }}
                >

                  <span className="price-badge">
                    {["Appartement meublé","Villa meublée","Chambre meublée"].includes(property.type)
                      ? `${property.pricePerNight} FCFA/nuit`
                      : `${property.price} FCFA/mois`
                    }
                  </span>

                </div>

                <div className="listing-info">

                  <p className="location">
                    📍 {property.city}
                  </p>

                  <h3>{property.title}</h3>

                  <div className="property-details">

                    <span>
                      <FaBed /> {property.rooms}
                    </span>

                    <span>
                      <FaBath /> {property.bathrooms}
                    </span>

                    <span>
                      <FiMaximize2 /> {property.surface} m²
                    </span>

                  </div>

                  <Link
                    to={`/property/${property.firebaseId}`}
                    className="details-btn"
                  >
                    Voir détails
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      <Footer />

    </>
  );
}

export default Favoris;