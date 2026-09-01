import { Link } from "react-router-dom";
import { useContext } from "react";
import { isFurnished } from "../utils/propertyUtils";


import { PropertyContext } from "../context/PropertyContext";
import appartement1 from "../assets/images/appartement1.jpg";
import appartement2 from "../assets/images/appartement2.jpg";
import maison1 from "../assets/images/maison1.jpg";
import maison2 from "../assets/images/maison2.jpg";

import { FiMaximize2 } from "react-icons/fi";
import { FaBed, FaBath } from "react-icons/fa";
import { TbBuildingEstate } from "react-icons/tb";
function Listings() {



  const {
  properties,
  reviewsCount,
  reviewsAverage
} = useContext(PropertyContext);
const popularProperties = properties
.filter((property) => !isFurnished(property.type))
.sort((a,b) => {

  if(a.premium && !b.premium) return -1;

  if(!a.premium && b.premium) return 1;

  return 0;

})
.slice(0,4);





  return (
    <section className="listings">
      <div className="listings-header">
        <h2>Logements populaires</h2>
       <Link to="/logements" className="see-all">
  Voir tout →
</Link>
      </div>
<div className="listings-grid">

{popularProperties.length > 0 ? (

  popularProperties.map((property) => (

   <div className="listing-card" key={property.firebaseId}>
      <div
        className="listing-image"
        style={{
          backgroundImage: `url(${property.images?.[0]})`,
        }}
      >

       <span className="price-badge">
{
isFurnished(property.type)
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
          Disponible
        </span>

      </div>


      <div className="listing-info">

        <p className="location">
          📍 {property.city}
        </p>

        <h3>{property.title}</h3>


        <div className="property-details">

          <span><FaBed /> {property.rooms} ch.</span>

          <span><FaBath /> {property.bathrooms} sdb</span>

          <span><FiMaximize2 /> {property.surface} m²</span>

        </div>


 <Link
  to={`/property/${property.firebaseId || property.id}`}
  className="details-btn"
>
  Voir le logement
</Link>


      </div>

    </div>

  ))

) : (

<>

{/* Carte exemple 1 */}
<div className="listing-card">
<div
className="listing-image"
style={{backgroundImage:`url(${appartement1})`}}
>
<span className="price-badge">
150 000 FCFA/mois
</span>
<span className="available-badge">
Disponible
</span>
</div>

<div className="listing-info">
<p className="location">📍 Dakar, Almadies</p>
<h3>Appartement 2 chambres</h3>
</div>
</div>


{/* Carte exemple 2 */}
<div className="listing-card">
<div
className="listing-image"
style={{backgroundImage:`url(${maison1})`}}
>
<span className="price-badge">
250 000 FCFA/mois
</span>
<span className="available-badge">
Disponible
</span>
</div>

<div className="listing-info">
<p className="location">📍 Dakar, Ngor</p>
<h3>Maison moderne</h3>
</div>
</div>


{/* Carte exemple 3 */}
<div className="listing-card">
<div
className="listing-image"
style={{backgroundImage:`url(${appartement2})`}}
>
<span className="price-badge">
80 000 FCFA/mois
</span>
<span className="available-badge">
Disponible
</span>
</div>

<div className="listing-info">
<p className="location">📍 Dakar, Sacré-Cœur</p>
<h3>Appartement meublé</h3>
</div>
</div>


{/* Carte exemple 4 */}
<div className="listing-card">
<div
className="listing-image"
style={{backgroundImage:`url(${maison2})`}}
>
<span className="price-badge">
300 000 FCFA/mois
</span>
<span className="available-badge">
Disponible
</span>
</div>

<div className="listing-info">
<p className="location">📍 Dakar, Point E</p>
<h3>Maison familiale</h3>
</div>
</div>

</>

)}

</div>


  <section className="short-stay-section">

    <div className="listings-header">
<h2 className="short-stay-title">
  <TbBuildingEstate />
  Séjours courte durée
</h2>
     <Link to="/logements" className="see-all">
  Voir tout →
</Link>
    </div>


    <div className="listings-grid">
{properties
  .filter(
    (property) =>
      property.type === "Appartement meublé" ||
      property.type === "Villa meublée" ||
      property.type === "Chambre meublée"
  )
  .sort((a,b)=>{

    if(a.premium && !b.premium) return -1;

    if(!a.premium && b.premium) return 1;

    return 0;

  })
  .slice(0,4)
  .map((property) => (
  <div className="listing-card" key={property.firebaseId}>
<div
  className="listing-image"
  style={{
    backgroundImage: `url(${property.images?.[0]})`
  }}
>

     <span className="price-badge">
 {property.pricePerNight} FCFA/nuit
</span>

{property.premium && (
  <span className="premium-badge">
    ⭐ PREMIUM
  </span>
)}

<>
<span
  className={`available-badge ${
    property.status === "loue"
      ? "status-rented"
      : "status-active"
  }`}
>
  {property.status === "loue"
    ? "🔴 Loué"
    : "🟢 Disponible"}
</span>

{(reviewsCount[property.firebaseId] || 0) >= 10 && (
  <span className="super-host-badge">
    ⭐ Super Hôte
  </span>
)}
</>

            </div>


            <div className="listing-info">

              <p className="location">
                📍 {property.city}
              </p>

              <h3>
                {property.title}
              </h3>
<div className="property-rating">
  {reviewsCount[property.firebaseId] > 0 ? (
    <>
      ⭐ {reviewsAverage[property.firebaseId]}/5
      <span>
        ({reviewsCount[property.firebaseId]} avis)
      </span>
    </>
  ) : (
    <span>
      Aucun avis
    </span>
  )}
</div>

              <div className="property-details">

                <span>
                  <FaBed /> {property.rooms} ch.
                </span>

                <span>
                  <FaBath /> {property.bathrooms} sdb
                </span>

                <span>
                  <FiMaximize2 /> {property.surface}m²
                </span>

              </div>

<Link
 to={`/property/${property.firebaseId || property.id}`}
  className="details-btn short-stay-btn"
>
  Voir le logement
</Link>

            </div>

          </div>

        ))}

 </div>

  </section>

</section>

  );
}

export default Listings;