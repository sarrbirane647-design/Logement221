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
import {
  FaHome,
  FaTag,
  FaMapMarkerAlt,
  FaTree,
  FaBuilding,
  FaHotel,
  FaConciergeBell,
  FaWifi,
  FaSnowflake,
  FaUtensils,
  FaCar,
  FaSwimmingPool,
  FaCamera,
  FaVideo,
  FaFileAlt,
  FaTrash,
  FaCheckCircle,
  FaDumbbell,
  FaSpa,
  FaShieldAlt,
  FaBolt,
  FaDoorOpen,
  FaTint,
  FaTv,
  FaTshirt,
  FaBox
} from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
function AjouterLogement() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { reloadProperties } = useContext(PropertyContext);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    transactionType: "location",
    title: "",
    city: "",
    neighborhood: "",
    type: "Appartement",
    price: "",
    rooms: "",
    bathrooms: "",
    surface: "",
    surfaceUnit: "m²",
    ownerName: "",
    phone: "",
    documentType: "",
    description: "",
    pricePerNight: "",
    minNights: "",
    /*
     * ================================
     * ÉQUIPEMENTS
     * ================================
     */
    wifi: false,
    climatisation: false,
    cuisine: false,
    parking: false,
    piscine: false,
    fitness: false,
    espaceDetente: false,
    ascenseur: false,
    videosurveillance: false,
    videophone: false,
    groupeElectrogene: false,
    gardiennage: false,
    eauChaude: false,
    terrasse: false,
    tv: false,
    laveLinge: false,
    refrigerateur: false,
    premium: false,
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const isSale = formData.transactionType === "vente";
  const isTerrain = formData.type === "Terrain";
  const isShortStay = [
    "Appartement meublé",
    "Villa meublée",
    "Chambre meublée"
  ].includes(formData.type);
  /*
   * Tous les biens sauf les terrains
   * peuvent avoir des équipements.
   */
  const canHaveEquipment = !isTerrain;
  const handleTransactionChange = (e) => {
    const transactionType = e.target.value;
    setFormData({
      ...formData,
      transactionType,
      type:
        transactionType === "vente"
          ? "Terrain"
          : "Appartement",
      pricePerNight: "",
      minNights: "",
      rooms: "",
      bathrooms: "",
      wifi: false,
      climatisation: false,
      cuisine: false,
      parking: false,
      piscine: false,
      fitness: false,
      espaceDetente: false,
      ascenseur: false,
      videosurveillance: false,
      videophone: false,
      groupeElectrogene: false,
      gardiennage: false,
      eauChaude: false,
      terrasse: false,
      tv: false,
      laveLinge: false,
      refrigerateur: false,
      documentType:
        transactionType === "vente"
          ? ""
          : formData.documentType,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Vous devez être connecté pour publier une annonce.");
      navigate("/connexion");
      return;
    }
    if (images.length === 0) {
      alert(
        isSale
          ? "Veuillez sélectionner au moins une photo du bien."
          : "Veuillez sélectionner au moins une image du logement."
      );
      return;
    }
    const prix = Number(formData.price);
    if (prix <= 0) {
      alert("Veuillez saisir un prix valide.");
      return;
    }
    if (isSale && !formData.surface) {
      alert("Veuillez saisir la superficie du terrain ou du bien.");
      return;
    }
    if (isSale && !formData.documentType) {
      alert("Veuillez sélectionner le type de document du bien.");
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
        /*
         * ================================
         * TYPE D'ANNONCE
         * ================================
         */
        transactionType: formData.transactionType,
        title: formData.title,
        city: formData.city,
        neighborhood: formData.neighborhood,
        type: formData.type,
        price: formData.price,
        /*
         * ================================
         * INFORMATIONS LOGEMENT
         * ================================
         */
        rooms: formData.rooms,
        bathrooms: formData.bathrooms,
        surface: formData.surface,
        surfaceUnit: formData.surfaceUnit,
        /*
         * ================================
         * INFORMATIONS VENDEUR
         * ================================
         */
        owner: {
          name: formData.ownerName,
          phone: formData.phone,
          email: user.email,
          uid: user.uid,
        },
        /*
         * ================================
         * DOCUMENT DU BIEN
         * ================================
         */
        documentType: formData.documentType,
        /*
         * ================================
         * MÉDIAS
         * ================================
         */
        images: imageUrls,
        video: videoUrl,
        /*
         * ================================
         * DESCRIPTION
         * ================================
         */
        description: formData.description,
        /*
         * ================================
         * COURTE DURÉE
         * ================================
         */
        pricePerNight: formData.pricePerNight,
        minNights: formData.minNights,
        /*
         * ================================
         * ÉQUIPEMENTS
         * ================================
         */
        wifi: formData.wifi,
        climatisation: formData.climatisation,
        cuisine: formData.cuisine,
        parking: formData.parking,
        piscine: formData.piscine,
        fitness: formData.fitness,
        espaceDetente: formData.espaceDetente,
        ascenseur: formData.ascenseur,
        videosurveillance: formData.videosurveillance,
        videophone: formData.videophone,
        groupeElectrogene: formData.groupeElectrogene,
        gardiennage: formData.gardiennage,
        eauChaude: formData.eauChaude,
        terrasse: formData.terrasse,
        tv: formData.tv,
        laveLinge: formData.laveLinge,
        refrigerateur: formData.refrigerateur,
        reviews: [],
      };
      const docRef = await addDoc(
        collection(db, "properties"),
        newProperty
      );
      console.log(
        "✅ ANNONCE PUBLIÉE :",
        docRef.id,
        newProperty
      );
      await reloadProperties();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      /*
       * ================================
       * RESET FORMULAIRE
       * ================================
       */
      setFormData({
        transactionType: "location",
        title: "",
        city: "",
        neighborhood: "",
        type: "Appartement",
        price: "",
        rooms: "",
        bathrooms: "",
        surface: "",
        surfaceUnit: "m²",
        ownerName: "",
        phone: "",
        documentType: "",
        description: "",
        pricePerNight: "",
        minNights: "",
        wifi: false,
        climatisation: false,
        cuisine: false,
        parking: false,
        piscine: false,
        fitness: false,
        espaceDetente: false,
        ascenseur: false,
        videosurveillance: false,
        videophone: false,
        groupeElectrogene: false,
        gardiennage: false,
        eauChaude: false,
        terrasse: false,
        tv: false,
        laveLinge: false,
        refrigerateur: false,
        premium: false,
      });
      setImages([]);
      setVideo(null);
    } catch (error) {
      console.error(
        "Erreur publication annonce :",
        error
      );
      alert(
        "Une erreur est survenue pendant l'envoi de l'annonce."
      );
    }
  };
  return (
    <>
      <Navbar />
      <section className="add-property-section">
        <div className="add-property-box">
          <h1>
            {isSale
              ? "Publier un bien à vendre"
              : "Ajouter votre logement"}
          </h1>
          {success && (
            <div className="success-message">
              Votre annonce a été publiée avec succès !
            </div>
          )}
          <p>
            {isSale
              ? "Publiez votre maison, villa, terrain ou autre bien immobilier à vendre."
              : "Remplissez les informations ci-dessous pour publier votre annonce."}
          </p>
          <form
            className="add-property-form"
            onSubmit={handleSubmit}
          >
            {/* ================================
                LOCATION / VENTE
            ================================= */}
            <select
              name="transactionType"
              value={formData.transactionType}
              onChange={handleTransactionChange}
              required
            >
              <option value="location">
                Location
              </option>
              <option value="vente">
                Vente
              </option>
            </select>
            {/* ================================
                TITRE
            ================================= */}
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={
                isSale
                  ? "Titre du bien à vendre"
                  : "Titre du logement"
              }
              required
            />
            {/* ================================
                VILLE
            ================================= */}
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ville"
              required
            />
            {/* ================================
                QUARTIER
            ================================= */}
            <input
              type="text"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              placeholder="Quartier / Localité"
              required
            />
            {/* ================================
                TYPE VENTE / LOCATION
            ================================= */}
            {isSale ? (
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Terrain">
                  Terrain
                </option>
                <option value="Maison à vendre">
                  Maison à vendre
                </option>
                <option value="Villa à vendre">
                  Villa à vendre
                </option>
                <option value="Appartement à vendre">
                  Appartement à vendre
                </option>
              </select>
            ) : (
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option>
                  Appartement
                </option>
                <option>
                  Maison
                </option>
                <option>
                  Chambre
                </option>
                <option>
                  Colocation
                </option>
                <option>
                  Appartement meublé
                </option>
                <option>
                  Villa meublée
                </option>
                <option>
                  Chambre meublée
                </option>
              </select>
            )}
            {/* ================================
                INFORMATIONS TERRAIN
            ================================= */}
            {isSale && isTerrain && (
              <div className="furnished-section">
                <h3 className="form-section-title">
                  <FaTree />
                  Informations sur le terrain
                </h3>
                <input
                  type="number"
                  name="surface"
                  value={formData.surface}
                  onChange={handleChange}
                  placeholder="Superficie"
                  min="1"
                  required
                />
                <select
                  name="surfaceUnit"
                  value={formData.surfaceUnit}
                  onChange={handleChange}
                  required
                >
                  <option value="m²">
                    m²
                  </option>
                  <option value="hectare">
                    Hectare(s)
                  </option>
                </select>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Type de document du terrain
                  </option>
                  <option value="Titre foncier">
                    Titre foncier
                  </option>
                  <option value="Bail">
                    Bail
                  </option>
                  <option value="Délibération">
                    Délibération
                  </option>
                  <option value="Autre">
                    Autre
                  </option>
                </select>
              </div>
            )}
            {/* ================================
                PRIX
            ================================= */}
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder={
                isSale
                  ? "Prix de vente (FCFA)"
                  : "Prix (FCFA)"
              }
              min="1"
              required
            />
            {/* ================================
                LOGEMENT À VENDRE
            ================================= */}
            {isSale && !isTerrain && (
              <>
                <input
                  type="number"
                  name="surface"
                  value={formData.surface}
                  onChange={handleChange}
                  placeholder="Superficie (m²)"
                  min="1"
                  required
                />
                <select
                  name="surfaceUnit"
                  value={formData.surfaceUnit}
                  onChange={handleChange}
                  required
                >
                  <option value="m²">
                    m²
                  </option>
                  <option value="hectare">
                    Hectare(s)
                  </option>
                </select>
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  placeholder="Nombre de chambres"
                  min="0"
                  required
                />
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="Nombre de salles de bain"
                  min="0"
                  required
                />
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Type de document du bien
                  </option>
                  <option value="Titre foncier">
                    Titre foncier
                  </option>
                  <option value="Bail">
                    Bail
                  </option>
                  <option value="Délibération">
                    Délibération
                  </option>
                  <option value="Autre">
                    Autre
                  </option>
                </select>
              </>
            )}
            {/* ================================
                LOCATION
            ================================= */}
            {!isSale && (
              <>
                {isShortStay && (
                  <div className="furnished-section">
                    <h3 className="form-section-title">
                      <FaHotel />
                      Informations pour la location courte durée
                    </h3>
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
                  </div>
                )}
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
              </>
            )}
            {/* ================================
                ÉQUIPEMENTS
            ================================= */}
            {canHaveEquipment && (
              <div className="equipements-section">
                <h3 className="form-section-title">
                  <FaConciergeBell />
                  Équipements et services
                </h3>
                <label className="equipment-option">
                  <input
                    type="checkbox"
                    name="wifi"
                    checked={formData.wifi}
                    onChange={handleChange}
                  />
                  <FaWifi />
                  <span>Wi-Fi</span>
                </label>
                <label className="equipment-option">
                  <input
                    type="checkbox"
                    name="climatisation"
                    checked={formData.climatisation}
                    onChange={handleChange}
                  />
                  <FaSnowflake />
                  <span>Climatisation</span>
                </label>
                <label className="equipment-option">
                  <input
                    type="checkbox"
                    name="cuisine"
                    checked={formData.cuisine}
                    onChange={handleChange}
                  />
                  <FaUtensils />
                  <span>Cuisine équipée</span>
                </label>
                <label className="equipment-option">
                  <input
                    type="checkbox"
                    name="parking"
                    checked={formData.parking}
                    onChange={handleChange}
                  />
                  <FaCar />
                  <span>Parking</span>
                </label>
                <label className="equipment-option">
                  <input
                    type="checkbox"
                    name="piscine"
                    checked={formData.piscine}
                    onChange={handleChange}
                  />
                  <FaSwimmingPool />
                  <span>Piscine</span>
                </label>
                <label className="equipment-option">
                  <input
                    type="checkbox"
                    name="fitness"
                    checked={formData.fitness}
                    onChange={handleChange}
                  />
                  <FaDumbbell />
                  <span>Salle de fitness</span>
                </label>
                <label className="equipment-option">
                  <input
                    type="checkbox"
                    name="espaceDetente"
                    checked={formData.espaceDetente}
                    onChange={handleChange}
                  />
                  <FaSpa />
                  <span>Espace détente</span>
                </label>
                <label className="equipment-option">
                  <input
                    type="checkbox"
                    name="ascenseur"
                    checked={formData.ascenseur}
                    onChange={handleChange}
                  />
                  <FaBuilding />
                  <span>Ascenseur</span>
                </label>
                <label className="equipment-option">
                  <input
                    type="checkbox"
                    name="videosurveillance"
                    checked={formData.videosurveillance}
                    onChange={handleChange}
                  />
                  <FaCamera />
                  <span>Vidéosurveillance</span>
                </label>
                <label className="equipment-option">
                  <input
                    type="checkbox"
                    name="videophone"
                    checked={formData.videophone}
                    onChange={handleChange}
                  />
                  <FaVideo />
                  <span>Vidéophone</span>
                </label>
                <label className="equipment-option">
                  <input
                    type="checkbox"
                    name="groupeElectrogene"
                    checked={formData.groupeElectrogene}
                    onChange={handleChange}
                  />
                  <FaBolt />
                  <span>Groupe électrogène</span>
                </label>
                <label className="equipment-option">
                  <input
                    type="checkbox"
                    name="gardiennage"
                    checked={formData.gardiennage}
                    onChange={handleChange}
                  />
                  <FaShieldAlt />
                  <span>Gardiennage / Sécurité</span>
                </label>
                <label className="equipment-option">
                  <input
                    type="checkbox"
                    name="eauChaude"
                    checked={formData.eauChaude}
                    onChange={handleChange}
                  />
                  <FaTint />
                  <span>Eau chaude</span>
                </label>
                <label className="equipment-option">
                  <input
                    type="checkbox"
                    name="terrasse"
                    checked={formData.terrasse}
                    onChange={handleChange}
                  />
                  <FaDoorOpen />
                  <span>Terrasse / Balcon</span>
                </label>
                {isShortStay && (
                  <>
                    <label className="equipment-option">
                      <input
                        type="checkbox"
                        name="tv"
                        checked={formData.tv}
                        onChange={handleChange}
                      />
                      <FaTv />
                      <span>Télévision</span>
                    </label>
                    <label className="equipment-option">
                      <input
                        type="checkbox"
                        name="laveLinge"
                        checked={formData.laveLinge}
                        onChange={handleChange}
                      />
                      <FaTshirt />
                      <span>Lave-linge</span>
                    </label>
                    <label className="equipment-option">
                      <input
                        type="checkbox"
                        name="refrigerateur"
                        checked={formData.refrigerateur}
                        onChange={handleChange}
                      />
                      <FaBox />
                      <span>Réfrigérateur</span>
                    </label>
                  </>
                )}
              </div>
            )}
            {/* ================================
                PROPRIÉTAIRE
            ================================= */}
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder={
                isSale
                  ? "Nom du propriétaire / vendeur"
                  : "Nom du propriétaire"
              }
              required
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={
                isSale
                  ? "Numéro du propriétaire / vendeur"
                  : "Numéro de téléphone"
              }
              required
            />
            {/* ================================
                PHOTOS
            ================================= */}
            <h3 className="form-section-title">
              <FaCamera />
              Photos du bien
            </h3>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const selectedImages =
                  Array.from(e.target.files);
                if (selectedImages.length > 10) {
                  alert(
                    "Vous pouvez ajouter maximum 10 photos."
                  );
                  return;
                }
                setImages(selectedImages);
              }}
              required
            />
            {images.length > 0 && (
              <div className="images-preview">
                {images.map((img, index) => (
                  <div
                    className="image-preview-box"
                    key={index}
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Aperçu ${index + 1}`}
                      className="image-preview"
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => {
                        const newImages =
                          images.filter(
                            (_, i) => i !== index
                          );
                        setImages(newImages);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* ================================
                VIDÉO
            ================================= */}
            <label>
              <>
                <FaVideo />
                Vidéo de présentation (facultatif)
              </>
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const selectedVideo =
                  e.target.files[0];
                if (
                  selectedVideo &&
                  selectedVideo.size >
                    50 * 1024 * 1024
                ) {
                  alert(
                    "La vidéo doit faire moins de 50 Mo."
                  );
                  return;
                }
                setVideo(selectedVideo);
              }}
            />
            {video && (
              <div className="video-preview">
                <h3>
                  <>
                    <FaVideo />
                    Aperçu de la vidéo
                  </>
                </h3>
                <video
                  controls
                  className="image-preview"
                >
                  <source
                    src={URL.createObjectURL(video)}
                    type={video.type}
                  />
                  Votre navigateur ne supporte pas la vidéo.
                </video>
              </div>
            )}
            {/* ================================
                DESCRIPTION
            ================================= */}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={
                isSale
                  ? "Description du bien : emplacement, environnement, accès, caractéristiques..."
                  : "Description du logement"
              }
              rows="5"
              required
            />
            {/* ================================
                PUBLICATION
            ================================= */}
            <button type="submit">
              {isSale
                ? "Publier le bien à vendre"
                : "Publier l'annonce"}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}
export default AjouterLogement;