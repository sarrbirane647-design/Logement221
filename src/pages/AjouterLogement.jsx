import "../App.css";
import { useState, useContext } from "react";
import { PropertyContext } from "../context/PropertyContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { uploadToCloudinary } from "../cloudinary";
import { db } from "../firebase";

import {
  collection,
  addDoc
} from "firebase/firestore";

import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function AjouterLogement() {
const { user } = useContext(UserContext);
const navigate = useNavigate();
  
 const [images, setImages] = useState([]);
 const [video, setVideo] = useState(null);
const [success, setSuccess] = useState(false);

const [formData, setFormData] = useState({
  title: "",
  city: "",
  type: "Appartement",
  price: "",
  rooms: "",
  bathrooms: "",
  surface: "",
  ownerName: "",
  phone: "",
  description: "",

 pricePerNight: "",
minNights: "",

wifi: false,
climatisation: false,
cuisine: false,
parking: false,
piscine: false,
premium: false,
});
 const { reloadProperties } = useContext(PropertyContext);

 const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData({
    ...formData,
    [name]: type === "checkbox" ? checked : value,
  });
};

const handleSubmit = async (e) => {

  e.preventDefault();

if(!user){

  alert("Vous devez être connecté pour publier une annonce.");

  navigate("/connexion");

  return;

}

  if (images.length === 0) {
    alert("Veuillez sélectionner au moins une image du logement.");
    return;
  }

  const prix = Number(formData.price);

  if (prix <= 0) {
    alert("Veuillez saisir un prix valide.");
    return;
  }

  try {

    const imageUrls = await Promise.all(
      images.map((image) => uploadToCloudinary(image))
    );


    let videoUrl = null;

    if (video) {
      videoUrl = await uploadToCloudinary(video);
    }


    const newProperty = {
  
createdAt: new Date().toISOString(),

views: 0,
favoritesCount: 0,
status: "active",

premium: false,
premiumPlan: null,
premiumDate: null,
premiumUntil: null,
premiumPaymentStatus: "pending",
  title: formData.title,
  city: formData.city,
  type: formData.type,
  price: formData.price,

  reviews: [],

  rooms: formData.rooms,
  bathrooms: formData.bathrooms,
  surface: formData.surface,

    owner: {
  name: formData.ownerName,
  phone: formData.phone,
  email: user.email,
  uid: user.uid,
},

      images: imageUrls,

      video: videoUrl,

      description: formData.description,

      pricePerNight: formData.pricePerNight,
      minNights: formData.minNights,

      wifi: formData.wifi,
climatisation: formData.climatisation,
cuisine: formData.cuisine,
parking: formData.parking,
piscine: formData.piscine,
    };


   const docRef = await addDoc(
  collection(db, "properties"),
  newProperty
);


const propertyWithId = {
  ...newProperty,
  firebaseId: docRef.id,
  id: docRef.id
};


await reloadProperties();


    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);


    setFormData({
      title: "",
      city: "",
      type: "Appartement",
      price: "",
      rooms: "",
      bathrooms: "",
      surface: "",
      ownerName: "",
      phone: "",
      description: "",
      pricePerNight: "",
minNights: "",

wifi: false,
climatisation: false,
cuisine: false,
parking: false,
piscine: false,
premium:false,
    });


    setImages([]);
    setVideo(null);


  } catch (error) {

   console.error("Erreur publication annonce :", error);

    alert("Une erreur est survenue pendant l'envoi des fichiers.");

  }

};

  return (
    <>
      <Navbar />

      <section className="add-property-section">
        <div className="add-property-box">

          <h1>Ajouter votre logement</h1>

          {success && (
            <div className="success-message">
              Votre annonce a été publiée avec succès !
            </div>
          )}

          <p>
            Remplissez les informations ci-dessous pour publier votre annonce.
          </p>

          <form
            className="add-property-form"
            onSubmit={handleSubmit}
          >

           <input
  type="text"
  name="title"
  value={formData.title}
  onChange={handleChange}
  placeholder="Titre du logement"
  required
/>

            <input
  type="text"
  name="city"
  value={formData.city}
  onChange={handleChange}
  placeholder="Ville"
  required
/>

 <select
  name="type"
  value={formData.type}
  onChange={handleChange}
  required
>
  <option>Appartement</option>
  <option>Maison</option>
  <option>Chambre</option>
  <option>Colocation</option>

  <option>Appartement meublé</option>
  <option>Villa meublée</option>
  <option>Chambre meublée</option>
</select>

{["Appartement meublé", "Villa meublée", "Chambre meublée"].includes(formData.type) && (
  <div className="furnished-section">
    <h3>🏨 Informations pour la location courte durée</h3>

<input
  type="number"
  name="pricePerNight"
  value={formData.pricePerNight}
  onChange={handleChange}
  placeholder="Prix par nuit (FCFA)"
/>
<input
  type="number"
  name="minNights"
  value={formData.minNights}
  onChange={handleChange}
  placeholder="Nombre minimum de nuits"
/>
<div className="equipements-section">

  <h3>🛎️ Équipements</h3>

  <label>
    <input
      type="checkbox"
      name="wifi"
      checked={formData.wifi}
      onChange={handleChange}
    />
    📶 Wi-Fi
  </label>

  <label>
    <input
      type="checkbox"
      name="climatisation"
      checked={formData.climatisation}
      onChange={handleChange}
    />
    ❄️ Climatisation
  </label>

  <label>
    <input
      type="checkbox"
      name="cuisine"
      checked={formData.cuisine}
      onChange={handleChange}
    />
    🍳 Cuisine équipée
  </label>

  <label>
    <input
      type="checkbox"
      name="parking"
      checked={formData.parking}
      onChange={handleChange}
    />
    🚗 Parking
  </label>

  {formData.type === "Villa meublée" && (
    <label>
      <input
        type="checkbox"
        name="piscine"
        checked={formData.piscine}
        onChange={handleChange}
      />
      🏊 Piscine
    </label>
  )}

</div>

  </div>
)}

            <input
  type="number"
  name="price"
  value={formData.price}
  onChange={handleChange}
  placeholder="Prix (FCFA)"
  required
/>

            <input
  type="number"
  name="rooms"
  value={formData.rooms}
  onChange={handleChange}
  placeholder="Nombre de chambres"
  required
/>

            <input
  type="number"
  name="bathrooms"
  value={formData.bathrooms}
  onChange={handleChange}
  placeholder="Nombre de salles de bain"
  required
/>

            <input
  type="number"
  name="surface"
  value={formData.surface}
  onChange={handleChange}
  placeholder="Superficie (m²)"
  required
/>

            <input
  type="text"
  name="ownerName"
  value={formData.ownerName}
  onChange={handleChange}
  placeholder="Nom du propriétaire"
  required
/>

            <input
  type="tel"
  name="phone"
  value={formData.phone}
  onChange={handleChange}
  placeholder="Numéro de téléphone"
  required
/>

 <input
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => {

    const selectedImages = Array.from(e.target.files);

    if (selectedImages.length > 10) {

      alert("Vous pouvez ajouter maximum 10 photos.");

      return;

    }

    setImages(selectedImages);

  }}
/>

   {images.length > 0 && (
  <div className="images-preview">

    {images.map((img, index) => (

      <div className="image-preview-box" key={index}>

        <img
          src={URL.createObjectURL(img)}
          alt={`Aperçu logement ${index + 1}`}
          className="image-preview"
        />

        <button
          type="button"
          className="remove-image-btn"
          onClick={() => {
            const newImages = images.filter(
              (_, i) => i !== index
            );

            setImages(newImages);
          }}
        >
          ❌
        </button>

      </div>

    ))}

  </div>
)}
{video && (
  <div className="video-preview">

    <h3>
      🎥 Aperçu de la vidéo
    </h3>

    <video
      controls
      className="image-preview"
    >
      <source
        src={URL.createObjectURL(video)}
        type="video/mp4"
      />

      Votre navigateur ne supporte pas la vidéo.
    </video>

  </div>
)}

{["Appartement meublé", "Villa meublée", "Chambre meublée"].includes(formData.type) && (
  <>
    <label>🎥 Vidéo de présentation (facultatif)</label>

   <input
  type="file"
  accept="video/*"
  onChange={(e) => {

    const selectedVideo = e.target.files[0];

    if (selectedVideo && selectedVideo.size > 50 * 1024 * 1024) {

      alert("La vidéo doit faire moins de 50 Mo.");

      return;

    }

    setVideo(selectedVideo);

  }}
/>
  </>
)}



           <textarea
  name="description"
  value={formData.description}
  onChange={handleChange}
  placeholder="Description du logement"
  rows="5"
  required
></textarea>

            <button type="submit">
              Publier l'annonce
            </button>

          </form>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default AjouterLogement;