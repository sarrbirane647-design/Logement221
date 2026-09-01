import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiSliders,
  FiClock,
  FiSearch
} from "react-icons/fi";
import heroImage from "../assets/images/hero.jpg";
function Hero() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) {
      params.append("city", city);
    }
    if (type) {
      params.append("type", type);
    }
    if (budget) {
      params.append("budget", budget);
    }
    navigate(`/logements?${params.toString()}`);
  };
  return (
    <section
      className="hero"
      style={{
        backgroundImage:
          `linear-gradient(rgba(0,0,0,0.50), rgba(0,0,0,0.50)), url(${heroImage})`
      }}
    >
      <h1>
        Trouvez votre logement <span className="highlight">idéal</span><br />
        <span className="highlight">au Sénégal</span>
      </h1>
      <p>
        Appartements, chambres, maisons et colocations accessibles rapidement
      </p>
      <div className="hero-buttons">
        <a href="#logements" className="explore-btn">
          Explorer les logements
        </a>
        <button
          className="hero-publish-btn"
          onClick={() => navigate("/ajouter-logement")}
        >
          Publier une annonce
        </button>
      </div>
      <div className="search-box">
        {/* =========================
            VILLE
        ========================= */}
        <div className="search-field">
          <span className="search-field-icon">
            <FiMapPin />
          </span>
          <div className="search-field-text">
            <label>
              Ville
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">
                Toutes les villes
              </option>
              <option value="Dakar">Dakar</option>
              <option value="Thiès">Thiès</option>
              <option value="Saly">Saly</option>
              <option value="Mbour">Mbour</option>
              <option value="Rufisque">Rufisque</option>
              <option value="Diamniadio">Diamniadio</option>
              <option value="Saint-Louis">Saint-Louis</option>
              <option value="Touba">Touba</option>
              <option value="Kaolack">Kaolack</option>
              <option value="Ziguinchor">Ziguinchor</option>
              <option value="Louga">Louga</option>
              <option value="Diourbel">Diourbel</option>
              <option value="Fatick">Fatick</option>
              <option value="Kolda">Kolda</option>
              <option value="Tambacounda">Tambacounda</option>
            </select>
          </div>
        </div>
        {/* =========================
            TYPE
        ========================= */}
        <div className="search-field">
          <span className="search-field-icon">
            <FiSliders />
          </span>
          <div className="search-field-text">
            <label>
              Type de logement
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">
                Tous les logements
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
          </div>
        </div>
        {/* =========================
    BUDGET
========================= */}
<div className="search-field">
  <span className="search-field-icon">
    <FiClock />
  </span>
  <div className="search-field-text">
    <label>
      {type === "Appartement meublé" ||
       type === "Villa meublée" ||
       type === "Chambre meublée"
        ? "Budget maximum / nuit"
        : type
        ? "Budget maximum / mois"
        : "Budget maximum"
      }
    </label>
    <select
      value={budget}
      onChange={(e) => setBudget(e.target.value)}
    >
      <option value="">
        Tous les budgets
      </option>
      {(
        type === "Appartement meublé" ||
        type === "Villa meublée" ||
        type === "Chambre meublée"
      ) ? (
        <>
          <option value="10000">
            10 000 FCFA / nuit
          </option>
          <option value="20000">
            20 000 FCFA / nuit
          </option>
          <option value="30000">
            30 000 FCFA / nuit
          </option>
          <option value="50000">
            50 000 FCFA / nuit
          </option>
          <option value="75000">
            75 000 FCFA / nuit
          </option>
          <option value="100000">
            100 000 FCFA / nuit
          </option>
        </>
      ) : (
        <>
          <option value="100000">
            100 000 FCFA / mois
          </option>
          <option value="150000">
            150 000 FCFA / mois
          </option>
          <option value="200000">
            200 000 FCFA / mois
          </option>
          <option value="300000">
            300 000 FCFA / mois
          </option>
          <option value="500000">
            500 000 FCFA / mois
          </option>
          <option value="750000">
            750 000 FCFA / mois
          </option>
          <option value="1000000">
            1 000 000 FCFA / mois
          </option>
        </>
      )}
    </select>
  </div>
</div>
        {/* =========================
            RECHERCHER
        ========================= */}
        <button
          className="search-btn"
          onClick={handleSearch}
        >
          <FiSearch /> Rechercher
        </button>
      </div>
    </section>
  );
}
export default Hero;