import { useContext } from "react";
import { Link } from "react-router-dom";
import { PropertyContext } from "../context/PropertyContext";
import "../App.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { FaPhone, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";

function Locadakar() {
  const { properties, loading } = useContext(PropertyContext);

  const locadakarProperties = properties.filter(
    (property) =>
      property.owner?.name?.toLowerCase().replace(/\s/g, "") ===
      "locadakar"
  );

  return (
    <>
      <SEO
        title="Locadakar | Agence immobilière au Sénégal | Logement221"
        description="Découvrez les biens immobiliers proposés par Locadakar sur Logement221 : appartements, maisons, villas et autres biens à louer ou à vendre au Sénégal."
        url="https://logement221.vercel.app/agence/locadakar"
      />

      <Navbar />

      <main className="agency-page">

        {/* =========================
            PRÉSENTATION AGENCE
        ========================= */}
        <section className="agency-header">

          <div className="agency-icon">
            <FaBuilding />
          </div>

          <div className="agency-header-info">

            <h1>Locadakar</h1>

            <p className="agency-subtitle">
              Agence immobilière — Location & Vente
            </p>

            <p className="agency-description">
              Découvrez les biens proposés par Locadakar sur
              Logement221. Consultez les annonces disponibles et
              contactez directement l'agence pour plus d'informations.
            </p>

            <a
              href="tel:+221775555570"
              className="agency-phone"
            >
              <FaPhone />
              77 555 55 70
            </a>

          </div>

        </section>

        {/* =========================
            ANNONCES
        ========================= */}
        <section className="agency-listings">

          <div className="agency-section-title">

            <h2>
              Les annonces de Locadakar
            </h2>

            <p>
              {loading
                ? "Chargement des annonces..."
                : `${locadakarProperties.length} annonce${
                    locadakarProperties.length > 1
                      ? "s"
                      : ""
                  } disponible${
                    locadakarProperties.length > 1
                      ? "s"
                      : ""
                  }`}
            </p>

          </div>

          {loading ? (

            <p className="loading-message">
              Chargement des annonces...
            </p>

          ) : locadakarProperties.length === 0 ? (

            <div className="agency-empty">

              <h3>
                Aucune annonce disponible
              </h3>

              <p>
                Les annonces de Locadakar apparaîtront ici
                lorsqu'elles seront publiées sur Logement221.
              </p>

            </div>

          ) : (

            <div className="agency-properties-grid">

              {locadakarProperties.map((property) => (

                <div
                  key={property.firebaseId}
                  className="agency-property-card"
                >

                  <Link
                    to={`/property/${property.firebaseId}`}
                    className="agency-property-image"
                  >

                    <img
                      src={
                        property.images?.[0] ||
                        property.image
                      }
                      alt={property.title}
                    />

                    <span className="agency-property-price">

                      {property.transactionType === "vente"
                        ? `${Number(
                            property.price || 0
                          ).toLocaleString("fr-FR")} FCFA`
                        : `${Number(
                            property.price || 0
                          ).toLocaleString("fr-FR")} FCFA/mois`}

                    </span>

                  </Link>

                  <div className="agency-property-info">

                    <p className="agency-property-location">
                      <FaMapMarkerAlt />
                      {property.city}
                      {property.neighborhood
                        ? ` — ${property.neighborhood}`
                        : ""}
                    </p>

                    <h3>
                      {property.title}
                    </h3>

                    <p className="agency-property-type">
                      {property.type}
                    </p>

                    <Link
                      to={`/property/${property.firebaseId}`}
                      className="agency-property-button"
                    >
                      Voir le bien
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Locadakar;