import "../App.css";
import { useState, useContext, useRef } from "react";
import { PropertyContext } from "../context/PropertyContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { uploadToCloudinary } from "../cloudinary";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
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
  FaBox,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Empêche plusieurs publications simultanées, même en cas
  // de clics rapides sur mobile.
  const submittingRef = useRef(false);

  // Permet de vider les champs de sélection des fichiers.
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

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

    // Équipements
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

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isSale = formData.transactionType === "vente";

  const isTerrain = formData.type === "Terrain";

  const isShortStay = [
    "Appartement meublé",
    "Villa meublée",
    "Chambre meublée",
  ].includes(formData.type);

  const canHaveEquipment = !isTerrain;

  const resetForm = () => {
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

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }

    // Remonter en haut du formulaire après la publication.
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleTransactionChange = (e) => {
    const transactionType = e.target.value;

    setFormData((prev) => ({
      ...prev,
      transactionType,
      type: transactionType === "vente" ? "Terrain" : "Appartement",
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
        transactionType === "vente" ? "" : prev.documentType,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Bloquer immédiatement les clics répétés.
    if (submittingRef.current) {
      return;
    }

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

    if (!Number.isFinite(prix) || prix <= 0) {
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

    // Le verrou est activé avant le premier envoi asynchrone.
    submittingRef.current = true;
    setIsSubmitting(true);
    setSuccess(false);

    try {
      // Envoyer les photos vers Cloudinary.
      const imageUrls = await Promise.all(
        images.map((image) => uploadToCloudinary(image))
      );

      // Envoyer la vidéo si elle existe.
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

        // Type de transaction
        transactionType: formData.transactionType,
        title: formData.title,
        city: formData.city,
        neighborhood: formData.neighborhood,
        type: formData.type,
        price: formData.price,

        // Informations du logement
        rooms: formData.rooms,
        bathrooms: formData.bathrooms,
        surface: formData.surface,
        surfaceUnit: formData.surfaceUnit,

        // Propriétaire
        owner: {
          name: formData.ownerName,
          phone: formData.phone,
          email: user.email,
          uid: user.uid,
        },

        // Documents
        documentType: formData.documentType,

        // Photos et vidéo
        images: imageUrls,
        video: videoUrl,

        // Description
        description: formData.description,

        // Location courte durée
        pricePerNight: formData.pricePerNight,
        minNights: formData.minNights,

        // Équipements
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

      // Enregistrer l'annonce dans Firebase.
      const docRef = await addDoc(
        collection(db, "properties"),
        newProperty
      );

      console.log("Annonce publiée :", docRef.id);

      // Vider le formulaire dès que Firebase a confirmé
      // l'enregistrement de l'annonce.
      resetForm();

      setSuccess(true);

      // Le rechargement des annonces ne doit pas bloquer
      // la réinitialisation du formulaire.
      Promise.resolve()
        .then(() => reloadProperties())
        .catch((error) => {
          console.error(
            "Erreur de rechargement des annonces :",
            error
          );
        });

    } catch (error) {
      console.error("Erreur publication annonce :", error);

      alert(
        "Une erreur est survenue pendant l'envoi de l'annonce. Vérifiez votre connexion et réessayez."
      );
    } finally {
      // Réactiver le bouton, même si une erreur survient.
      submittingRef.current = false;
      setIsSubmitting(false);
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
            <div
              className="success-message"
              role="status"
              aria-live="polite"
            >
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
            {/* LOCATION / VENTE */}
            <select
              name="transactionType"
              value={formData.transactionType}
              onChange={handleTransactionChange}
              disabled={isSubmitting}
              required
            >
              <option value="location">Location</option>
              <option value="vente">Vente</option>
            </select>

            {/* TITRE */}
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
              disabled={isSubmitting}
              required
            />

            {/* VILLE */}
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ville"
              disabled={isSubmitting}
              required
            />

            {/* QUARTIER */}
            <input
              type="text"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              placeholder="Quartier / Localité"
              disabled={isSubmitting}
              required
            />

            {/* TYPE DE BIEN */}
            {isSale ? (
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              >
                <option value="Terrain">Terrain</option>
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
                disabled={isSubmitting}
                required
              >
                <option value="Appartement">Appartement</option>
                <option value="Maison">Maison</option>
                <option value="Chambre">Chambre</option>
                <option value="Colocation">Colocation</option>
                <option value="Appartement meublé">
                  Appartement meublé
                </option>
                <option value="Villa meublée">Villa meublée</option>
                <option value="Chambre meublée">
                  Chambre meublée
                </option>
              </select>
            )}

            {/* INFORMATIONS TERRAIN */}
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
                  disabled={isSubmitting}
                  required
                />

                <select
                  name="surfaceUnit"
                  value={formData.surfaceUnit}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                >
                  <option value="m²">m²</option>
                  <option value="hectare">Hectare(s)</option>
                </select>

                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                >
                  <option value="">
                    Type de document du terrain
                  </option>
                  <option value="Titre foncier">
                    Titre foncier
                  </option>
                  <option value="Bail">Bail</option>
                  <option value="Délibération">
                    Délibération
                  </option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            )}

            {/* PRIX */}
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder={
                isSale ? "Prix de vente (FCFA)" : "Prix (FCFA)"
              }
              min="1"
              disabled={isSubmitting}
              required
            />

            {/* LOGEMENT À VENDRE */}
            {isSale && !isTerrain && (
              <>
                <input
                  type="number"
                  name="surface"
                  value={formData.surface}
                  onChange={handleChange}
                  placeholder="Superficie (m²)"
                  min="1"
                  disabled={isSubmitting}
                  required
                />

                <select
                  name="surfaceUnit"
                  value={formData.surfaceUnit}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                >
                  <option value="m²">m²</option>
                  <option value="hectare">Hectare(s)</option>
                </select>

                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  placeholder="Nombre de chambres"
                  min="0"
                  disabled={isSubmitting}
                  required
                />

                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="Nombre de salles de bain"
                  min="0"
                  disabled={isSubmitting}
                  required
                />

                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                >
                  <option value="">
                    Type de document du bien
                  </option>
                  <option value="Titre foncier">
                    Titre foncier
                  </option>
                  <option value="Bail">Bail</option>
                  <option value="Délibération">
                    Délibération
                  </option>
                  <option value="Autre">Autre</option>
                </select>
              </>
            )}

            {/* LOCATION */}
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
                      disabled={isSubmitting}
                    />

                    <input
                      type="number"
                      name="minNights"
                      value={formData.minNights}
                      onChange={handleChange}
                      placeholder="Nombre minimum de nuits"
                      disabled={isSubmitting}
                    />
                  </div>
                )}

                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  placeholder="Nombre de chambres"
                  disabled={isSubmitting}
                  required
                />

                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="Nombre de salles de bain"
                  disabled={isSubmitting}
                  required
                />

                <input
                  type="number"
                  name="surface"
                  value={formData.surface}
                  onChange={handleChange}
                  placeholder="Superficie (m²)"
                  disabled={isSubmitting}
                  required
                />
              </>
            )}

            {/* ÉQUIPEMENTS */}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
                      />
                      <FaBox />
                      <span>Réfrigérateur</span>
                    </label>
                  </>
                )}
              </div>
            )}

            {/* PROPRIÉTAIRE */}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              required
            />

            {/* PHOTOS */}
            <h3 className="form-section-title">
              <FaCamera />
              Photos du bien
            </h3>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              disabled={isSubmitting}
              onChange={(e) => {
                const selectedImages = Array.from(
                  e.target.files || []
                );

                if (selectedImages.length > 10) {
                  alert(
                    "Vous pouvez ajouter maximum 10 photos."
                  );
                  e.target.value = "";
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
                    key={`${img.name}-${img.lastModified}-${index}`}
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Aperçu ${index + 1}`}
                      className="image-preview"
                    />

                    <button
                      type="button"
                      className="remove-image-btn"
                      disabled={isSubmitting}
                      onClick={() => {
                        const newImages = images.filter(
                          (_, i) => i !== index
                        );

                        setImages(newImages);

                        if (
                          newImages.length === 0 &&
                          imageInputRef.current
                        ) {
                          imageInputRef.current.value = "";
                        }
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* VIDÉO */}
            <label>
              <FaVideo />
              Vidéo de présentation (facultatif)
            </label>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              disabled={isSubmitting}
              onChange={(e) => {
                const selectedVideo = e.target.files?.[0] || null;

                if (
                  selectedVideo &&
                  selectedVideo.size > 50 * 1024 * 1024
                ) {
                  alert("La vidéo doit faire moins de 50 Mo.");
                  e.target.value = "";
                  return;
                }

                setVideo(selectedVideo);
              }}
            />

            {video && (
              <div className="video-preview">
                <h3>
                  <FaVideo />
                  Aperçu de la vidéo
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

            {/* DESCRIPTION */}
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
              disabled={isSubmitting}
              required
            />

            {/* PUBLICATION */}
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="publication-spinner"
                    aria-hidden="true"
                  />
                  Publication en cours...
                </>
              ) : isSale ? (
                "Publier le bien à vendre"
              ) : (
                "Publier l'annonce"
              )}
            </button>
          </form>
        </div>
      </section>

      <Footer />

      <style>{`
        .publication-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          margin-right: 8px;
          vertical-align: -2px;
          border: 2px solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: publication-spin 0.7s linear infinite;
        }

        .add-property-form button[type="submit"]:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @keyframes publication-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .publication-spinner {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}

export default AjouterLogement;