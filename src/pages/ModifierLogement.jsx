import "../App.css";
import { uploadToCloudinary } from "../cloudinary";
import { useState, useContext, useEffect } from "react";
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
import SEO from "../components/SEO";

function ModifierLogement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    properties,
    setProperties,
    loading
  } = useContext(PropertyContext);

  const { user } = useContext(UserContext);

  const property = properties.find(
    (item) =>
      item.firebaseId === id &&
      item.owner?.uid === user?.uid
  );

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("Appartement");

  const [price, setPrice] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [minNights, setMinNights] = useState("");

  const [rooms, setRooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [surface, setSurface] = useState("");

  const [description, setDescription] = useState("");

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const [wifi, setWifi] = useState(false);
  const [climatisation, setClimatisation] = useState(false);
  const [cuisine, setCuisine] = useState(false);
  const [parking, setParking] = useState(false);
  const [piscine, setPiscine] = useState(false);

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  const isShortStay =
    type === "Appartement meublé" ||
    type === "Villa meublée" ||
    type === "Chambre meublée";

  useEffect(() => {
    if (!property) return;

    setTitle(property.title || "");
    setCity(property.city || "");
    setType(property.type || "Appartement");

    setPrice(property.price || "");
    setPricePerNight(property.pricePerNight || "");
    setMinNights(property.minNights || "");

    setRooms(property.rooms || "");
    setBathrooms(property.bathrooms || "");
    setSurface(property.surface || "");

    setDescription(property.description || "");

    setPhone(property.owner?.phone || "");
    setName(property.owner?.name || "");

    setWifi(property.wifi || false);
    setClimatisation(property.climatisation || false);
    setCuisine(property.cuisine || false);
    setParking(property.parking || false);
    setPiscine(property.piscine || false);
  }, [property]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let newImages = property.images || [];

      if (newImages.length === 0 && property.image) {
        newImages = [property.image];
      }

      let newVideo = property.video || null;

      /*
       * Si l'utilisateur ajoute de nouvelles photos,
       * elles remplacent les anciennes photos,
       * comme dans le fonctionnement actuel de Modifier.
       */
      if (images.length > 0) {
        newImages = [];

        for (const image of images) {
          const imageUrl = await uploadToCloudinary(image);
          newImages.push(imageUrl);
        }
      }

      /*
       * Une nouvelle vidéo remplace l'ancienne.
       * Si aucune nouvelle vidéo n'est sélectionnée,
       * l'ancienne est conservée.
       */
      if (video) {
        newVideo = await uploadToCloudinary(video);
      }

      /*
       * On conserve toutes les autres données existantes
       * grâce à ...property.
       */
      const updatedProperty = {
        ...property,

        title,
        city,
        type,

        /*
         * Logement classique :
         * le prix mensuel est modifiable.
         *
         * Logement courte durée :
         * on conserve le prix mensuel existant.
         */
        price: isShortStay
          ? property.price || ""
          : price,

        /*
         * Prix par nuit uniquement pour les logements meublés.
         */
        pricePerNight: isShortStay
          ? pricePerNight
          : property.pricePerNight || "",

        /*
         * Nombre minimum de nuits uniquement
         * pour les logements courte durée.
         */
        minNights: isShortStay
          ? minNights
          : property.minNights || "",

        rooms,
        bathrooms,
        surface,

        description,

        owner: {
          ...property.owner,
          name,
          phone,
        },

        images: newImages,
        image: newImages[0] || "",

        video: isShortStay
          ? newVideo
          : property.video || null,

        /*
         * Équipements courte durée.
         * Pour un logement classique, on conserve
         * les valeurs déjà présentes.
         */
        wifi: isShortStay
          ? wifi
          : property.wifi || false,

        climatisation: isShortStay
          ? climatisation
          : property.climatisation || false,

        cuisine: isShortStay
          ? cuisine
          : property.cuisine || false,

        parking: isShortStay
          ? parking
          : property.parking || false,

        piscine: isShortStay
          ? piscine
          : property.piscine || false,
      };

      console.log(
        "📝 MODIFICATION EN COURS :",
        updatedProperty
      );

      console.log(
        "🆔 ID DU LOGEMENT :",
        id
      );

      console.log(
        "🏠 TYPE DU LOGEMENT :",
        type
      );

      console.log(
        "💰 PRIX MENSUEL :",
        updatedProperty.price
      );

      console.log(
        "🌙 PRIX PAR NUIT :",
        updatedProperty.pricePerNight
      );

      console.log(
        "🌙 NOMBRE MINIMUM DE NUITS :",
        updatedProperty.minNights
      );

      console.log(
        "🛎️ ÉQUIPEMENTS :",
        {
          wifi: updatedProperty.wifi,
          climatisation: updatedProperty.climatisation,
          cuisine: updatedProperty.cuisine,
          parking: updatedProperty.parking,
          piscine: updatedProperty.piscine,
        }
      );

      console.log(
        "👤 UTILISATEUR :",
        user?.uid
      );

      console.log(
        "👤 PROPRIÉTAIRE :",
        property.owner?.uid
      );

      await updateDoc(
        doc(db, "properties", id),
        updatedProperty
      );

      console.log(
        "✅ LOGEMENT MODIFIÉ AVEC SUCCÈS DANS FIREBASE"
      );

      setProperties((prev) =>
        prev.map((item) =>
          item.firebaseId === id
            ? {
                ...item,
                ...updatedProperty,
              }
            : item
        )
      );

      navigate("/mes-annonces");

    } catch (error) {
      console.error(
        "❌ ERREUR MODIFICATION FIREBASE :",
        error
      );

      alert(
        "La modification n'a pas pu être enregistrée. Vérifie la console."
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <section className="property-page">
          <h2>
            Chargement du logement...
          </h2>
        </section>

        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Navbar />

        <section className="property-page">
          <h2>
            Vous n'avez pas l'autorisation de modifier ce logement.
          </h2>

          <button
            onClick={() =>
              navigate("/mes-annonces")
            }
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
      <SEO
        title="Modifier mon logement | Logement221"
        description="Modifiez les informations de votre annonce de logement sur Logement221."
        url={`https://logement221.vercel.app/modifier-logement/${id}`}
        noindex={true}
      />

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
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Titre du logement"
              required
            />

            <input
              type="text"
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
              placeholder="Ville"
              required
            />

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
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

            {isShortStay && (
              <div className="furnished-section">

                <h3>
                  🏨 Informations pour la location courte durée
                </h3>

                <input
                  type="number"
                  value={pricePerNight}
                  onChange={(e) =>
                    setPricePerNight(e.target.value)
                  }
                  placeholder="Prix par nuit (FCFA)"
                  required
                />

                <input
                  type="number"
                  value={minNights}
                  onChange={(e) =>
                    setMinNights(e.target.value)
                  }
                  placeholder="Nombre minimum de nuits"
                />

                <div className="equipements-section">

                  <h3>
                    🛎️ Équipements
                  </h3>

                  <label>
                    <input
                      type="checkbox"
                      checked={wifi}
                      onChange={(e) =>
                        setWifi(e.target.checked)
                      }
                    />
                    📶 Wi-Fi
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={climatisation}
                      onChange={(e) =>
                        setClimatisation(e.target.checked)
                      }
                    />
                    ❄️ Climatisation
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={cuisine}
                      onChange={(e) =>
                        setCuisine(e.target.checked)
                      }
                    />
                    🍳 Cuisine équipée
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={parking}
                      onChange={(e) =>
                        setParking(e.target.checked)
                      }
                    />
                    🚗 Parking
                  </label>

                  {type === "Villa meublée" && (
                    <label>
                      <input
                        type="checkbox"
                        checked={piscine}
                        onChange={(e) =>
                          setPiscine(e.target.checked)
                        }
                      />
                      🏊 Piscine
                    </label>
                  )}

                </div>

              </div>
            )}

            {!isShortStay && (
              <input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                placeholder="Prix mensuel (FCFA)"
                required
              />
            )}

            <input
              type="number"
              value={rooms}
              onChange={(e) =>
                setRooms(e.target.value)
              }
              placeholder="Nombre de chambres"
              required
            />

            <input
              type="number"
              value={bathrooms}
              onChange={(e) =>
                setBathrooms(e.target.value)
              }
              placeholder="Nombre de salles de bain"
              required
            />

            <input
              type="number"
              value={surface}
              onChange={(e) =>
                setSurface(e.target.value)
              }
              placeholder="Superficie (m²)"
              required
            />

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Nom du propriétaire"
              required
            />

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Numéro de téléphone"
              required
            />

            <label>
              Nouvelles photos
            </label>

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
            />

            {images.length > 0 && (
              <div className="images-preview">

                {images.map(
                  (image, index) => (
                    <div
                      className="image-preview-box"
                      key={index}
                    >

                      <img
                        src={URL.createObjectURL(
                          image
                        )}
                        alt={`Aperçu logement ${index + 1}`}
                        className="image-preview"
                      />

                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => {

                          const newImages =
                            images.filter(
                              (_, i) =>
                                i !== index
                            );

                          setImages(newImages);

                        }}
                      >
                        ❌
                      </button>

                    </div>
                  )
                )}

              </div>
            )}

            {isShortStay && (
              <>
                <label>
                  🎥 Nouvelle vidéo de présentation (facultatif)
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
                      🎥 Aperçu de la vidéo
                    </h3>

                    <video
                      controls
                      className="image-preview"
                    >
                      <source
                        src={URL.createObjectURL(
                          video
                        )}
                        type={video.type}
                      />

                      Votre navigateur ne supporte pas la vidéo.
                    </video>

                  </div>
                )}
              </>
            )}

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Description du logement"
              rows="5"
              required
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