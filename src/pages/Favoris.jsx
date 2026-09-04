import { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext";
import { PropertyContext } from "../context/PropertyContext";
import { FaBed, FaBath } from "react-icons/fa";
import { FiMaximize2 } from "react-icons/fi";
function Favoris() {
  const { favorites } = useContext(UserContext);
  const { properties } = useContext(PropertyContext);
  // On garde uniquement les favoris dont le logement existe encore
  const validFavorites = favorites.filter((favorite) =>
    properties.some(
      (property) =>
        property.firebaseId === favorite.firebaseId
    )
  );
  return (
    <>
      <Navbar />
      <section className="listings">
        <div className="listings-header">
          <h2>❤️ Mes favoris</h2>
        </div>
        {validFavorites.length === 0 ? (
          <p className="no-properties">
            Vous n'avez aucun favori.
          </p>
        ) : (
          <div className="listings-grid">
            {validFavorites.map((property) => (
              <div
                className="listing-card"
                key={property.firebaseId}
              >
                {/* PHOTO CLIQUABLE */}
                <Link
                  to={`/property/${property.firebaseId}`}
                  className="listing-image-link"
                >
                  <div
                    className="listing-image"
                    style={{
                      backgroundImage: `url(${
                        property.images?.[0] || property.image
                      })`
                    }}
                  >
                    <span className="price-badge">
                      {[
                        "Appartement meublé",
                        "Villa meublée",
                        "Chambre meublée"
                      ].includes(property.type)
                        ? `${property.pricePerNight} FCFA/nuit`
                        : `${property.price} FCFA/mois`
                      }
                    </span>
                    {property.premium && (
                      <span className="premium-badge">
                        ⭐ PREMIUM
                      </span>
                    )}
                    <span className="available-badge">
                      {property.status === "loue"
                        ? "🔴 Loué"
                        : "🟢 Disponible"
                      }
                    </span>
                  </div>
                </Link>
                <div className="listing-info">
                  {/* TITRE + INFOS CLIQUABLES */}
                  <Link
                    to={`/property/${property.firebaseId}`}
                    className="listing-info-link"
                  >
                    <p className="location">
                      📍 {property.city}
                    </p>
                    <h3>
                      {property.title}
                    </h3>
                    <div className="property-details">
                      <span>
                        <FaBed />
                        {property.rooms || 0} ch.
                      </span>
                      <span>
                        <FaBath />
                        {property.bathrooms || 0} sdb.
                      </span>
                      <span>
                        <FiMaximize2 />
                        {property.surface || 0} m²
                      </span>
                    </div>
                  </Link>
                  {/* BOUTON */}
                  <Link
                    to={`/property/${property.firebaseId}`}
                    className="details-btn"
                  >
                    Voir le logement
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