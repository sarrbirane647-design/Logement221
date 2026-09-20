import { useContext, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PropertyContext } from "../context/PropertyContext";
import "../App.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { isFurnished } from "../utils/propertyUtils";
import { FaBed, FaBath, FaHome, FaTag } from "react-icons/fa";
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
  const [searchTransaction, setSearchTransaction] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const resultsRef = useRef(null);
  // =========================
  // OUTILS
  // =========================
  const normalizeText = (text) => {
    return String(text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  };
  const isSale = (property) => {
    return property.transactionType === "vente";
  };
  const getPropertyPrice = (property) => {
    if (isFurnished(property.type)) {
      return Number(property.pricePerNight || 0);
    }
    return Number(property.price || 0);
  };
  // =========================
  // FILTRAGE
  // =========================
  const filteredProperties = properties.filter((property) => {
    // =========================
    // VILLE
    // =========================
    const matchCity =
      (!city ||
        normalizeText(property.city) ===
          normalizeText(city)) &&
      (!searchCity ||
        normalizeText(property.city).includes(
          normalizeText(searchCity)
        ));
    // =========================
    // TYPE
    // =========================
    const matchType =
      (!type || property.type === type) &&
      (!searchType || property.type === searchType);
    // =========================
    // LOCATION / VENTE
    // =========================
    const matchTransaction =
      !searchTransaction ||
      (searchTransaction === "vente" &&
        property.transactionType === "vente") ||
      (searchTransaction === "location" &&
        property.transactionType !== "vente");
    // =========================
    // PRIX
    // =========================
    const propertyPrice = getPropertyPrice(property);
    const matchBudget =
      !budget ||
      propertyPrice <= Number(budget);
    return (
      matchCity &&
      matchType &&
      matchTransaction &&
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
      const priceA = getPropertyPrice(a);
      const priceB = getPropertyPrice(b);
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
  const isSaleSearch =
    searchTransaction === "vente" ||
    (properties.length > 0 &&
      sortedProperties.length > 0 &&
      sortedProperties.every(
        (property) =>
          property.transactionType === "vente"
      ));
  const seoTitle =
    searchTransaction === "vente"
      ? city
        ? `Biens à vendre à ${city} | Logement221`
        : "Biens immobiliers à vendre au Sénégal | Logement221"
      : city && type
      ? `${type} à louer à ${city} | Logement221`
      : city
      ? `Logements à louer à ${city} | Logement221`
      : type
      ? `${type}s à louer au Sénégal | Logement221`
      : "Logements à louer au Sénégal | Logement221";
  const seoDescription =
    searchTransaction === "vente"
      ? city
        ? `Découvrez les biens immobiliers à vendre à ${city} sur Logement221 : terrains, maisons, villas et appartements.`
        : "Découvrez les biens immobiliers à vendre au Sénégal sur Logement221 : terrains, maisons, villas et appartements."
      : city && type
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
        {/* LOCATION / VENTE */}
        <select
          value={searchTransaction}
          onChange={(e) =>
            setSearchTransaction(e.target.value)
          }
        >
          <option value="">
            Location et vente
          </option>
          <option value="location">
            🏠 À louer
          </option>
          <option value="vente">
            🏷️ À vendre
          </option>
        </select>
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
          {/* LOCATIONS */}
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
          {/* VENTES */}
          <option value="Terrain">
            🌳 Terrain
          </option>
          <option value="Maison à vendre">
            🏠 Maison à vendre
          </option>
          <option value="Villa à vendre">
            🏡 Villa à vendre
          </option>
          <option value="Appartement à vendre">
            🏢 Appartement à vendre
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
            setSearchTransaction("");
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
        {sortedProperties.length} annonce(s)
        trouvée(s)
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
            Aucune annonce ne correspond à votre recherche.
          </p>
        ) : (
          sortedProperties.map(
            (property, index) => {
              const propertyIsSale =
                isSale(property);
              const propertyIsTerrain =
                property.type === "Terrain";
              const propertyIsFurnished =
                isFurnished(property.type);
              return (
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
                        {propertyIsSale
                          ? `${Number(
                              property.price || 0
                            ).toLocaleString(
                              "fr-FR"
                            )} FCFA`
                          : propertyIsFurnished
                          ? `${Number(
                              property.pricePerNight ||
                                0
                            ).toLocaleString(
                              "fr-FR"
                            )} FCFA/nuit`
                          : `${Number(
                              property.price || 0
                            ).toLocaleString(
                              "fr-FR"
                            )} FCFA/mois`
                        }
                      </span>
                      {/* TYPE DE TRANSACTION */}
<span
  className={
    propertyIsSale
      ? "transaction-badge sale-badge"
      : "transaction-badge rental-badge"
  }
>
  {propertyIsSale ? (
    <>
      <FaTag />
      À vendre
    </>
  ) : (
    <>
      <FaHome />
      À louer
    </>
  )}
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
                            : property.status ===
                              "attente"
                            ? "status-pending"
                            : "status-active"
                        }`}
                      >
                        {property.status === "loue"
                          ? "🔴 Loué"
                          : property.status ===
                            "attente"
                          ? "🟡 En attente"
                          : propertyIsSale
                          ? "🟢 Disponible"
                          : "🟢 Disponible"}
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
                        {property.neighborhood
                          ? ` — ${property.neighborhood}`
                          : ""}
                      </p>
                      <h3>
                        {property.title}
                      </h3>
                      <div className="property-details">
                        {!propertyIsTerrain && (
                          <>
                            <span>
                              <FaBed />{" "}
                              {property.rooms || 0}{" "}
                              ch.
                            </span>
                            <span>
                              <FaBath />{" "}
                              {property.bathrooms ||
                                0}{" "}
                              sdb
                            </span>
                          </>
                        )}
                        <span>
                          <FiMaximize2 />{" "}
                          {property.surface || 0}
                          {property.surfaceUnit ||
                            "m²"}
                        </span>
                      </div>
                      {/* DOCUMENT TERRAIN / BIEN */}
                      {propertyIsSale &&
                        property.documentType && (
                        <p className="property-document">
                          📄{" "}
                          {property.documentType}
                        </p>
                      )}
                    </Link>
                    {/* =========================
                        VOIR LE BIEN
                    ========================= */}
                    <Link
                      to={`/property/${
                        property.firebaseId ||
                        property.id
                      }`}
                      className="details-btn short-stay-btn"
                    >
                      {propertyIsSale
                        ? "Voir le bien"
                        : "Voir le logement"}
                    </Link>
                  </div>
                </div>
              );
            }
          )
        )}
      </section>
      <Footer />
    </>
  );
}
export default Logements;