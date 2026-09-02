import "../App.css";
import { uploadToCloudinary } from "../cloudinary";
import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PropertyContext } from "../context/PropertyContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "../firebase";
import { UserContext } from "../context/UserContext";


function ModifierLogement() {

  const { id } = useParams();

  const navigate = useNavigate();

  const { properties, setProperties } = useContext(PropertyContext);
const { user } = useContext(UserContext);

const property = properties.find(
  (item) =>
    item.firebaseId === id &&
    item.owner?.uid === user?.uid
);


  const [title, setTitle] = useState(property?.title || "");
  const [city, setCity] = useState(property?.city || "");
  const [type, setType] = useState(property?.type || "Appartement");
  const [price, setPrice] = useState(property?.price || "");
  const [rooms, setRooms] = useState(property?.rooms || "");
  const [bathrooms, setBathrooms] = useState(property?.bathrooms || "");
  const [surface, setSurface] = useState(property?.surface || "");
  const [description, setDescription] = useState(property?.description || "");
  const [phone, setPhone] = useState(property?.owner?.phone || "");
  const [name, setName] = useState(property?.owner?.name || "");
  const [images, setImages] = useState([]);
const [video, setVideo] = useState(null);


const handleSubmit = async (e) => {

e.preventDefault();

let newImages = property.images || [property.image];
let newVideo = property.video || "";

if (images.length > 0) {
  newImages = [];

  for (const image of images) {
    const imageUrl = await uploadToCloudinary(image);
    newImages.push(imageUrl);
  }
}

if (video) {
  newVideo = await uploadToCloudinary(video);
}

const updatedProperty = {
  ...property,

  title,
  city,
  type,
  price,
  rooms,
  bathrooms,
  surface,
  description,

  images: newImages,
  image: newImages[0],

  video: newVideo,

 owner:{
  ...property.owner,
  name,
  phone,
}
};

const updatedProperties = properties.map((item) =>
  item.firebaseId === id
    ? updatedProperty
    : item
);

await updateDoc(
  doc(db,"properties",id),
  updatedProperty
);


setProperties(updatedProperties);

navigate("/mes-annonces");

  };


if(!property){

  return (
    <>
      <Navbar />

      <section className="property-page">

        <h2>
          Vous n'avez pas l'autorisation de modifier ce logement.
        </h2>

        <button
          onClick={() => navigate("/mes-annonces")}
        >
          Retour à mes annonces
        </button>

      </section>

      <Footer />
    </>
  );

}



  return (

    <>

      <Navbar />


      <section className="add-property-section">

        <div className="add-property-box">


          <h1>
            Modifier votre logement
          </h1>



          <form
            className="add-property-form"
            onSubmit={handleSubmit}
          >


            <input
              type="text"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              placeholder="Titre du logement"
            />


            <input
              type="text"
              value={city}
              onChange={(e)=>setCity(e.target.value)}
              placeholder="Ville"
            />


            <select
              value={type}
              onChange={(e)=>setType(e.target.value)}
            >

              <option>Appartement</option>
              <option>Maison</option>
              <option>Chambre</option>
              <option>Colocation</option>
<option>Appartement meublé</option>
<option>Villa meublée</option>
<option>Chambre meublée</option>

            </select>



            <input
              type="number"
              value={price}
              onChange={(e)=>setPrice(e.target.value)}
              placeholder="Prix"
            />



            <input
              type="number"
              value={rooms}
              onChange={(e)=>setRooms(e.target.value)}
              placeholder="Chambres"
            />



            <input
              type="number"
              value={bathrooms}
              onChange={(e)=>setBathrooms(e.target.value)}
              placeholder="Salle de bain"
            />



            <input
              type="number"
              value={surface}
              onChange={(e)=>setSurface(e.target.value)}
              placeholder="Superficie"
            />



            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Nom propriétaire"
            />



            <input
              type="tel"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
              placeholder="Téléphone"
            />


            <textarea
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              rows="5"
              placeholder="Description"
            ></textarea>

<label>
  Nouvelles photos
</label>

<input
  type="file"
  multiple
  accept="image/*"
  onChange={(e)=>setImages([...e.target.files])}
/>

<div className="preview-images">

{images.map((image,index)=>(
  <img
    key={index}
    src={URL.createObjectURL(image)}
    alt="preview"
  />
))}

</div>

<label>
  Nouvelle vidéo
</label>

<input
  type="file"
  accept="video/*"
  onChange={(e)=>setVideo(e.target.files[0])}
/>


            <button type="submit">
              Enregistrer les modifications
            </button>


          </form>


        </div>


      </section>


      <Footer />

    </>

  );

}


export default ModifierLogement;