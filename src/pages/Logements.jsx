import { useContext, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PropertyContext } from "../context/PropertyContext";
import "../App.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { isFurnished } from "../utils/propertyUtils";
import { FaBed, FaBath } from "react-icons/fa";
import { FiMaximize2 } from "react-icons/fi";
import SEO from "../components/SEO";

function Logements() {
  const { properties, loading } = useContext(PropertyContext);
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city");
  const type = searchParams.get("type");
  const budget = searchParams.get("budget");
  const [searchCity, setSearchCity] = useState("");
  const [searchType, setSearchType] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const resultsRef = useRef(null);
  // =========================
  // FILTRAGE
  // =========================
  const filteredProperties = properties.filter((property) => {
    // VILLE
    const normalizeText = (text) => {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
};

const matchCity =
  (!city ||
    normalizeText(property.city) === normalizeText(city)) &&
  (!searchCity ||
    normalizeText(property.city).includes(
      normalizeText(searchCity)
    ));
    // TYPE
    const matchType =
      (!type || property.type === type) &&
      (!searchType || property.type === searchType);
    // PRIX
    const propertyPrice = Number(
      isFurnished(property.type)
        ? property.pricePerNight
        : property.price
    );
    const matchBudget =
      !budget ||
      propertyPrice <= Number(budget);
    return (
      matchCity &&
      matchType &&
      matchBudget
    );
  });
  // =========================
  // TRI
  // =========================
  const sortedProperties = [...filteredProperties].sort(
    (a, b) => {
      // ⭐ PREMIUM EN PREMIER
      if (a.premium && !b.premium) return -1;
      if (!a.premium && b.premium) return 1;
      const priceA = Number(
        isFurnished(a.type)
          ? a.pricePerNight
          : a.price
      );
      const priceB = Number(
        isFurnished(b.type)
          ? b.pricePerNight
          : b.price
      );
      if (sortPrice === "asc") {
        return priceA - priceB;
      }
      if (sortPrice === "desc") {
        return priceB - priceA;
      }
      return 0;
    }
  );
  // =========================
// SEO DYNAMIQUE
// =========================
const seoTitle =
  city && type
    ? `${type} à louer à ${city} | Logement221`
    : city
    ? `Logements à louer à ${city} | Logement221`
    : type
    ? `${type}s à louer au Sénégal | Logement221`
    : "Logements à louer au Sénégal | Logement221";

const seoDescription =
  city && type
    ? `Découvrez les ${type.toLowerCase()}s à louer à ${city} sur Logement221. Consultez les annonces disponibles, les prix et les détails des logements.`
    : city
    ? `Découvrez les logements à louer à ${city} sur Logement221 : appartements, maisons, chambres, colocations et logements meublés.`
    : type
    ? `Découvrez les ${type.toLowerCase()}s à louer au Sénégal sur Logement221. Consultez les annonces disponibles et trouvez votre logement idéal.`
    : "Découvrez les logements à louer au Sénégal sur Logement221 : appartements, maisons, chambres, colocations et logements meublés à Dakar et dans plusieurs villes.";
  // =========================
  // CHARGEMENT
  // =========================
  if (loading) {
    return (
      <>
      <SEO
  title="Logements à louer au Sénégal | Logement221"
  description="Découvrez les logements à louer au Sénégal sur Logement221 : appartements, maisons, chambres, colocations et logements meublés à Dakar et dans plusieurs villes."
  url="https://logement221.vercel.app/logements"
/>
        <Navbar />
        <h2 className="loading-message">
          Chargement des logements...
        </h2>
        <Footer />
      </>
    );
  }
  // =========================
  // AFFICHAGE
  // =========================
return (
  <>
   <SEO
  title={seoTitle}
  description={seoDescription}
  url="https://logement221.vercel.app/logements"
/>

    <Navbar />
      {/* =========================
          FILTRES
      ========================= */}
      <div className="logements-filter">
        {/* TRI PRIX */}
        <select
          value={sortPrice}
          onChange={(e) =>
            setSortPrice(e.target.value)
          }
        >
          <option value="">
            Trier par prix
          </option>
          <option value="asc">
            Prix croissant
          </option>
          <option value="desc">
            Prix décroissant
          </option>
        </select>
        {/* RECHERCHE VILLE */}
        <input
          type="text"
          placeholder="Rechercher une ville..."
          value={searchCity}
          onChange={(e) =>
            setSearchCity(e.target.value)
          }
        />
        {/* TYPE */}
        <select
          value={searchType}
          onChange={(e) =>
            setSearchType(e.target.value)
          }
        >
          <option value="">
            Tous les types
          </option>
          <option value="Appartement">
            Appartement
          </option>
          <option value="Maison">
            Maison
          </option>
          <option value="Chambre">
            Chambre
          </option>
          <option value="Colocation">
            Colocation
          </option>
          <option value="Appartement meublé">
            Appartement meublé
          </option>
          <option value="Villa meublée">
            Villa meublée
          </option>
          <option value="Chambre meublée">
            Chambre meublée
          </option>
        </select>
        {/* RECHERCHER */}
        <button
          onClick={() => {
            resultsRef.current?.scrollIntoView({
              behavior: "smooth"
            });
          }}
        >
          Rechercher
        </button>
        {/* EFFACER */}
        <button
          className="reset-filter"
          onClick={() => {
            setSearchCity("");
            setSearchType("");
            setSortPrice("");
          }}
        >
          Effacer
        </button>
      </div>
      {/* =========================
          COMPTEUR
      ========================= */}
      <p className="results-count">
        {sortedProperties.length} logement(s)
        trouvé(s)
      </p>
      {/* =========================
          LISTE
      ========================= */}
      <section
        ref={resultsRef}
        className="listings logements-page"
      >
        {sortedProperties.length === 0 ? (
          <p className="no-properties">
            Aucun logement ne correspond à votre recherche.
          </p>
        ) : (
          sortedProperties.map(
            (property, index) => (
           <div
  key={
    property.firebaseId ||
    property.id ||
    index
  }
  className="listing-card logement-card"
>

  {/* =========================
      IMAGE
  ========================= */}

  <Link
    to={`/property/${
      property.firebaseId ||
      property.id
    }`}
    className="listing-image-link"
  >

    <div
      className="listing-image"
      style={{
        backgroundImage:
          `url(${property.images?.[0]})`
      }}
    >

      {/* PRIX */}

      <span className="price-badge">

        {isFurnished(property.type)
          ? `${Number(
              property.pricePerNight || 0
            ).toLocaleString("fr-FR")} FCFA/nuit`

          : `${Number(
              property.price || 0
            ).toLocaleString("fr-FR")} FCFA/mois`
        }

      </span>

      {/* PREMIUM */}

      {property.premium && (

        <span className="premium-badge">
          ⭐ PREMIUM
        </span>

      )}

      {/* STATUT */}

      <span
        className={`available-badge ${
          property.status === "loue"
            ? "status-rented"
            : property.status === "attente"
            ? "status-pending"
            : "status-active"
        }`}
      >

        {property.status === "loue"
          ? "🔴 Loué"
          : property.status === "attente"
          ? "🟡 En attente"
          : "🟢 Disponible"
        }

      </span>

    </div>

  </Link>


  {/* =========================
      INFORMATIONS
  ========================= */}

  <div className="listing-info">

    <Link
      to={`/property/${
        property.firebaseId ||
        property.id
      }`}
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
          <FaBed /> {property.rooms || 0} ch.
        </span>

        <span>
          <FaBath /> {property.bathrooms || 0} sdb
        </span>

        <span>
          <FiMaximize2 /> {property.surface || 0}m²
        </span>

      </div>

    </Link>


    {/* =========================
        VOIR LE LOGEMENT
    ========================= */}

    <Link
      to={`/property/${
        property.firebaseId ||
        property.id
      }`}
      className="details-btn short-stay-btn"
    >
      Voir le logement
    </Link>

  </div>

</div>
            )
          )
        )}
      </section>
      <Footer />
    </>
  );
}
export default Logements;