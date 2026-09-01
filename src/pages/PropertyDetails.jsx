import { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PropertyContext } from "../context/PropertyContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GalleryModal from "../components/GalleryModal";
import MapLocation from "../components/MapLocation";
import { db } from "../firebase";
import { isFurnished } from "../utils/propertyUtils";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";

import { UserContext } from "../context/UserContext";

import appartement1 from "../assets/images/appartement1.jpg";
import appartement2 from "../assets/images/appartement2.jpg";
import maison1 from "../assets/images/maison1.jpg";
import maison2 from "../assets/images/maison2.jpg";


function PropertyDetails() {

const [rating, setRating] = useState(0);
const [comment, setComment] = useState("");

  const { id } = useParams();
const {
  properties,
  loading
} = useContext(PropertyContext);

const {
  user,
  favorites,
  addFavorite,
  removeFavorite,
  loadingUser
} = useContext(UserContext);

  const [isFavorite, setIsFavorite] = useState(false);
const [currentIndex, setCurrentIndex] = useState(0);
const [showGallery, setShowGallery] = useState(false);
const [touchStart, setTouchStart] = useState(null);
const [touchEnd, setTouchEnd] = useState(null);
const [reviews,setReviews] = useState([]);

  const popularProperties = [
    {
      title: "Appartement 2 chambres",
      city: "Dakar, Almadies",
      price: "150 000",
      type: "Appartement",
      image: appartement1
    },
    {
      title: "Maison moderne",
      city: "Dakar, Ngor",
      price: "250 000",
      type: "Maison",
      image: maison1
    },
    {
      title: "Appartement meublé",
      city: "Dakar, Sacré-Cœur",
      price: "80 000",
      type: "Appartement",
      image: appartement2
    },
    {
      title: "Maison familiale",
      city: "Dakar, Point E",
      price: "300 000",
      type: "Maison",
      image: maison2
    }
  ];


  let property;


if (id.startsWith("popular")) {

  const index = id.split("-")[1];
  property = popularProperties[index];

} else {

property = properties.find(
  (item) =>
    String(item.firebaseId) === String(id) ||
    String(item.id) === String(id)
);
}
const media = property

  ? [
      ...(property.images || []),
      ...(property.video ? [property.video] : []),
    ]
  : [];

 const averageRating = reviews.length
  ? (
      reviews.reduce(
        (total, review) => total + review.rating,
        0
      ) / reviews.length
    ).toFixed(1)
  : null;

 
  const nextMedia = () => {

  if (media.length === 0) return;

  setCurrentIndex((prev) =>
    prev === media.length - 1 ? 0 : prev + 1
  );

};

const previousMedia = () => {

  if (media.length === 0) return;

  setCurrentIndex((prev) =>
    prev === 0 ? media.length - 1 : prev - 1
  );

};

useEffect(() => {

  if (property) {

    const alreadyFavorite = favorites.some(
      item => item.firebaseId === property.firebaseId
    );

    setIsFavorite(alreadyFavorite);

  }

}, [favorites, property]);


useEffect(()=>{

const loadReviews = async()=>{

const q = query(
 collection(db,"reviews"),
 where("propertyId","==",property.firebaseId)
);


const snapshot = await getDocs(q);


setReviews(
 snapshot.docs.map(doc=>doc.data())
);


};


if(property){
 loadReviews();
}

},[property]);



const toggleFavorite = async () => {

  if (!user) {
    alert("Veuillez vous connecter.");
    return;
  }

  console.log("LOGEMENT FAVORI :", property);

  if (isFavorite) {
    await removeFavorite(property);
    setIsFavorite(false);
  } else {
    await addFavorite(property);
    setIsFavorite(true);
  }

};


const handleTouchStart = (e) => {
  setTouchStart(e.touches[0].clientX);
};


const handleTouchMove = (e) => {
  setTouchEnd(e.touches[0].clientX);
};


const handleTouchEnd = () => {

  const distance = touchStart - touchEnd;

  // Swipe vers la gauche ➡️ photo suivante
  if (distance > 50) {
    nextMedia();
  }

  // Swipe vers la droite ⬅️ photo précédente
  if (distance < -50) {
    previousMedia();
  }

  // Reset
  setTouchStart(0);
  setTouchEnd(0);

};

const addReview = async () => {

  
  if(rating === 0 || comment.trim() === ""){
    alert("Veuillez mettre une note et un avis");
    return;
  }


  try {

  let userName = "Visiteur";

if (user) {

  const userRef = doc(
    db,
    "users",
    user.uid
  );

  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {

    userName =
      userSnap.data().name ||
      userSnap.data().displayName ||
      user.email;

  } else {

    userName = user.displayName || user.email;

  }

}
    const newReview = {

      propertyId: property.firebaseId,

      rating: rating,

      comment: comment,

      date: new Date().toLocaleDateString(),

      name: userName

    };


    await addDoc(
      collection(db,"reviews"),
      newReview
    );

    setReviews([
  ...reviews,
  newReview
]);

    setRating(0);
    setComment("");


    alert("Merci pour votre avis ⭐");


  } catch(error){

    console.error(
      "Erreur ajout avis :",
      error
    );

    alert(
      "Impossible d'ajouter l'avis"
    );

  }

};

useEffect(() => {

  const handleKeyDown = (e) => {

    if (e.key === "Escape") {
      setShowGallery(false);
    }

    if (e.key === "ArrowRight") {
      nextMedia();
    }

    if (e.key === "ArrowLeft") {
      previousMedia();
    }

  };

  window.addEventListener("keydown", handleKeyDown);

  return () =>
    window.removeEventListener(
      "keydown",
      handleKeyDown
    );

}, [currentIndex]);

useEffect(() => {

  const addView = async () => {

    console.log("AJOUT VUE :", property.firebaseId);

    if (!property?.firebaseId) return;

    const viewKey = `view-${property.firebaseId}`;

    const lastView = localStorage.getItem(viewKey);

    // Bloque les vues répétées pendant 24h
    if (lastView) {

      const timePassed =
        Date.now() - Number(lastView);

      const oneDay = 24 * 60 * 60 * 1000;

      if (timePassed < oneDay) {
        return;
      }

    }


    await addDoc(
      collection(db,"views"),
      {
        propertyId: property.firebaseId,
        date: serverTimestamp()
      }
    );


    localStorage.setItem(
      viewKey,
      Date.now().toString()
    );


  };


  if(property){
    addView();
  }


},[property]);

if (loading || loadingUser) {
  return (
    <>
      <Navbar />

      <h2 className="loading-message">
        Chargement du logement...
      </h2>

      <Footer />
    </>
  );
}

  return (
    <>

      <Navbar />


      <section className="property-page">


        {property ? (

          <>

<div className="property-gallery">

<div className="gallery-counter">
  {currentIndex + 1} / {media.length}
</div>

  <button
    className="gallery-arrow left"
    onClick={previousMedia}
  >
    ◀
  </button>

  {media.length > 0 &&
  media[currentIndex]?.includes("/video/") ? (

  <video
  className="property-detail-image"
  controls
  autoPlay
  muted
  playsInline
  onError={(e) => {
   
  }}
>
  <source
    src={media[currentIndex]}
    type="video/mp4"
  />

  Votre navigateur ne supporte pas cette vidéo.
</video>

  ) : (

 <img
  className="property-detail-image"
  src={
    media.length > 0
      ? media[currentIndex]
      : property.image
  }
  alt={property.title}
  onClick={() => setShowGallery(true)}
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
/>

  )}

  <button
    className="gallery-arrow right"
    onClick={nextMedia}
  >
    ▶
  </button>

</div>

<div className="gallery-thumbnails">

  {media.map((item, index) => (

    item.includes(".mp4") ? (

      <div
        key={index}
        className={
          currentIndex === index
            ? "gallery-thumb active-thumb"
            : "gallery-thumb"
        }
        onClick={() => setCurrentIndex(index)}
      >
        🎥
      </div>

    ) : (

      <img
        key={index}
        src={item}
        alt={`Photo ${index + 1}`}
        className={
          currentIndex === index
            ? "gallery-thumb active-thumb"
            : "gallery-thumb"
        }
        onClick={() => setCurrentIndex(index)}
      />

    )

  ))}

</div>

            <div className="property-detail-content">

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
    : "🟢 Disponible"}
</span>


              <h1>
                {property.title}
              </h1>

{averageRating && (
  <p className="average-rating">
    ⭐ {averageRating}/5 ({reviews.length} avis)
  </p>
)}

              <button
                className="favorite-btn"
                onClick={toggleFavorite}
              >
                {isFavorite 
                  ? "❤️ Favori" 
                  : "🤍 Ajouter aux favoris"
                }
              </button>


            <h2 className="property-price">

  {isFurnished(property.type)
    ? `${property.pricePerNight} FCFA / nuit`
    : `${property.price} FCFA / mois`
  }

</h2>


              <p className="property-city">
                📍 {property.city}
              </p>



<MapLocation city={property.city} />

             <div className="property-features">

  <div>🛏️ {property.rooms} chambre(s)</div>

  <div>🚿 {property.bathrooms} salle(s) de bain</div>

  <div>📐 {property.surface} m²</div>

  {property.parking && (
    <div>🚗 Parking</div>
  )}

</div>


              <h3>Description</h3>


             <p className="property-description">
  {property.description}
</p>

<div className="review-box">

  <h3>⭐ Donner votre avis</h3>

  <div className="stars">

    {[1,2,3,4,5].map((star)=>(

      <span
        key={star}
        onClick={() => setRating(star)}
        style={{
          cursor:"pointer",
          fontSize:"30px",
          color: star <= rating ? "gold" : "#ccc"
        }}
      >
        ★
      </span>

    ))}

  </div>


  <textarea
    placeholder="Écrivez votre avis..."
    value={comment}
    onChange={(e)=>setComment(e.target.value)}
  />

<button
  onClick={() => {
    addReview();
  }}
>
  Publier mon avis
</button>


</div>
{reviews.length > 0 && (

  <div className="reviews-list">

    <h3>⭐ Avis des utilisateurs</h3>

   {reviews.map((review, index) => (
<div key={index} className="review-card">

<h4>
👤 {review.name || "Utilisateur"}
</h4>

<p>
  {"⭐".repeat(review.rating)}
</p>

<p>
{review.comment}
</p>

<small>
{review.date}
</small>

</div>

    ))}

  </div>

)}

{["Appartement meublé", "Villa meublée", "Chambre meublée"].includes(property.type) && (

  <div className="property-equipements">

    <h3>🛎️ Équipements</h3>

    {property.wifi && <p>📶 Wi-Fi</p>}

    {property.climatisation && <p>❄️ Climatisation</p>}

    {property.cuisine && <p>🍳 Cuisine équipée</p>}

    {property.parking && <p>🚗 Parking</p>}

    {property.piscine && <p>🏊 Piscine</p>}

    {property.pricePerNight && (
      <p>💰 {property.pricePerNight} FCFA / nuit</p>
    )}

    {property.minNights && (
      <p>🌙 Minimum {property.minNights} nuit(s)</p>
    )}

  </div>

)}
<div className="owner-box">
  <h3>
    👤 Propriétaire
  </h3>

  <p>
    {property.owner?.name || "Propriétaire"}
  </p>

  <a
  className="contact-owner-btn"
  href={`https://wa.me/${property.owner?.phone}?text=${encodeURIComponent(
    `Bonjour, je suis intéressé par votre logement "${property.title}". ${
      property.status === "loue"
        ? "Je vois que ce logement est actuellement loué. Avez-vous un autre logement disponible ?"
        : "Est-il toujours disponible ?"
    }`
  )}`}
  target="_blank"
  rel="noopener noreferrer"
>
  💬 Contacter sur WhatsApp
</a>

</div>


            </div>

          </>


        ) : (

          <h2>
            Logement introuvable
          </h2>

        )}

<GalleryModal
  showGallery={showGallery}
  setShowGallery={setShowGallery}
  media={media}
  currentIndex={currentIndex}
  setCurrentIndex={setCurrentIndex}
/>

        <h2 className="similar-title">
          Logements similaires
        </h2>


        <div className="similar-properties">

{property && properties
.filter(
  (item) => item.firebaseId !== property.firebaseId
)
.slice(0,4)
.map((item)=>(

<Link
  to={`/property/${item.firebaseId}`}
  className="similar-card"
  key={item.firebaseId}
>

<img
  src={item.images?.[0]}
  alt={item.title}
/>

<div className="similar-info">

<h3>
{item.title}
</h3>

<p>
📍 {item.city}
</p>

<span>
{["Appartement meublé", "Villa meublée", "Chambre meublée"].includes(item.type)
? `${item.pricePerNight} FCFA/nuit`
: `${item.price} FCFA/mois`
}
</span>

</div>

</Link>

))}



        </div>


      </section>


      <Footer />

    </>
  );
}


export default PropertyDetails;