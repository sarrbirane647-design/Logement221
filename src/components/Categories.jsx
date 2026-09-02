import { Link } from "react-router-dom";
import { useContext, useMemo } from "react";

import appartement from "../assets/images/categorie-appartement.jpg";
import maison from "../assets/images/categorie-maison.jpg";
import chambre from "../assets/images/categorie-chambre.jpg";
import colocation from "../assets/images/categorie-colocation.jpg";

import { PropertyContext } from "../context/PropertyContext";

import { FaBuilding, FaHouse, FaBed, FaUsers } from "react-icons/fa6";

function Categories() {
  const { properties, loading } = useContext(PropertyContext);

  const counts = useMemo(() => {
    return {
      appartements: properties.filter(
        (p) => p.type?.includes("Appartement")
      ).length,

      maisons: properties.filter(
        (p) =>
          p.type?.includes("Maison") ||
          p.type?.includes("Villa")
      ).length,

      chambres: properties.filter(
        (p) => p.type?.includes("Chambre")
      ).length,

      colocations: properties.filter(
        (p) => p.type?.includes("Colocation")
      ).length,
    };
  }, [properties]);

  const {
    appartements,
    maisons,
    chambres,
    colocations
  } = counts;

  if (loading) {
    return (
      <section className="categories">
        <h2>Catégories</h2>
        <p>Chargement des logements...</p>
      </section>
    );
  }

  return (
    <section className="categories">

      <h2>Catégories</h2>

      <div className="categories-grid">

        <Link
          to="/logements?type=Appartement"
          className="category-card"
        >
          <div className="category-image-box">

            <img
              src={appartement}
              alt="Appartement"
              className="category-image"
            />

            <div className="category-icon">
              <FaBuilding />
            </div>

          </div>

          <h3>Appartements</h3>
          <p>{appartements} logement(s)</p>

        </Link>


        <Link
          to="/logements?type=Maison"
          className="category-card"
        >
          <div className="category-image-box">

            <img
              src={maison}
              alt="Maison"
              className="category-image"
            />

            <div className="category-icon">
              <FaHouse />
            </div>

          </div>

          <h3>Maisons</h3>
          <p>{maisons} logement(s)</p>

        </Link>


        <Link
          to="/logements?type=Chambre"
          className="category-card"
        >
          <div className="category-image-box">

            <img
              src={chambre}
              alt="Chambre"
              className="category-image"
            />

            <div className="category-icon">
              <FaBed />
            </div>

          </div>

          <h3>Chambres</h3>
          <p>{chambres} logement(s)</p>

        </Link>


        <Link
          to="/logements?type=Colocation"
          className="category-card"
        >
          <div className="category-image-box">

            <img
              src={colocation}
              alt="Colocation"
              className="category-image"
            />

            <div className="category-icon">
              <FaUsers />
            </div>

          </div>

          <h3>Colocations</h3>
          <p>{colocations} logement(s)</p>

        </Link>

      </div>

    </section>
  );
}

export default Categories;