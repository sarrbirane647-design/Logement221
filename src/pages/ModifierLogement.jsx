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

  const { user } =
    useContext(UserContext);

  const property =
    properties.find(
      (item) =>
        item.firebaseId === id &&
        item.owner?.uid === user?.uid
    );

  // =========================
  // INFORMATIONS PRINCIPALES
  // =========================

  const [transactionType, setTransactionType] =
    useState("location");

  const [title, setTitle] =
    useState("");

  const [city, setCity] =
    useState("");

  const [neighborhood, setNeighborhood] =
    useState("");

  const [type, setType] =
    useState("Appartement");

  const [price, setPrice] =
    useState("");

  const [pricePerNight, setPricePerNight] =
    useState("");

  const [minNights, setMinNights] =
    useState("");

  const [rooms, setRooms] =
    useState("");

  const [bathrooms, setBathrooms] =
    useState("");

  const [surface, setSurface] =
    useState("");

  const [surfaceUnit, setSurfaceUnit] =
    useState("m²");

  const [documentType, setDocumentType] =
    useState("");

  const [description, setDescription] =
    useState("");

  // =========================
  // PROPRIÉTAIRE
  // =========================

  const [phone, setPhone] =
    useState("");

  const [name, setName] =
    useState("");

  // =========================
  // ÉQUIPEMENTS
  // =========================

  const [wifi, setWifi] =
    useState(false);

  const [climatisation, setClimatisation] =
    useState(false);

  const [cuisine, setCuisine] =
    useState(false);

  const [parking, setParking] =
    useState(false);

  const [piscine, setPiscine] =
    useState(false);

  // =========================
  // MÉDIAS
  // =========================

  const [images, setImages] =
    useState([]);

  const [video, setVideo] =
    useState(null);

  // =========================
  // TYPES
  // =========================

  const isSale =
    transactionType === "vente";

  const isTerrain =
    type === "Terrain";

  const isShortStay =
    type === "Appartement meublé" ||
    type === "Villa meublée" ||
    type === "Chambre meublée";

  // =========================
  // CHARGEMENT DES DONNÉES
  // =========================

  useEffect(() => {

    if (!property) return;

    setTransactionType(
      property.transactionType ||
      "location"
    );

    setTitle(
      property.title || ""
    );

    setCity(
      property.city || ""
    );

    setNeighborhood(
      property.neighborhood || ""
    );

    setType(
      property.type ||
      "Appartement"
    );

    setPrice(
      property.price || ""
    );

    setPricePerNight(
      property.pricePerNight || ""
    );

    setMinNights(
      property.minNights || ""
    );

    setRooms(
      property.rooms || ""
    );

    setBathrooms(
      property.bathrooms || ""
    );

    setSurface(
      property.surface || ""
    );

    setSurfaceUnit(
      property.surfaceUnit ||
      "m²"
    );

    setDocumentType(
      property.documentType ||
      ""
    );

    setDescription(
      property.description || ""
    );

    setPhone(
      property.owner?.phone || ""
    );

    setName(
      property.owner?.name || ""
    );

    setWifi(
      property.wifi || false
    );

    setClimatisation(
      property.climatisation ||
      false
    );

    setCuisine(
      property.cuisine ||
      false
    );

    setParking(
      property.parking ||
      false
    );

    setPiscine(
      property.piscine ||
      false
    );

  }, [property]);

  // =========================
  // CHANGEMENT LOCATION / VENTE
  // =========================

  const handleTransactionChange =
    (e) => {

      const newTransaction =
        e.target.value;

      setTransactionType(
        newTransaction
      );

      if (
        newTransaction ===
        "vente"
      ) {

        setType(
          "Terrain"
        );

        setPricePerNight("");
        setMinNights("");

        setWifi(false);
        setClimatisation(false);
        setCuisine(false);
        setParking(false);
        setPiscine(false);

      } else {

        setType(
          "Appartement"
        );

        setDocumentType("");
      }
    };

  // =========================
  // ENREGISTRER
  // =========================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        if (
          !title.trim() ||
          !city.trim() ||
          !neighborhood.trim()
        ) {

          alert(
            "Veuillez remplir le titre, la ville et le quartier/localité."
          );

          return;
        }

        if (
          !price ||
          Number(price) <= 0
        ) {

          alert(
            "Veuillez saisir un prix valide."
          );

          return;
        }

        if (
          isSale &&
          !surface
        ) {

          alert(
            "Veuillez saisir la superficie du bien."
          );

          return;
        }

        if (
          isSale &&
          !documentType
        ) {

          alert(
            "Veuillez sélectionner le type de document du bien."
          );

          return;
        }

        // =========================
        // PHOTOS
        // =========================

        let newImages =
          property.images || [];

        if (
          newImages.length === 0 &&
          property.image
        ) {

          newImages = [
            property.image
          ];

        }

        /*
         * Si de nouvelles photos
         * sont sélectionnées,
         * elles remplacent les anciennes.
         */

        if (
          images.length > 0
        ) {

          newImages = [];

          for (
            const image of images
          ) {

            const imageUrl =
              await uploadToCloudinary(
                image
              );

            newImages.push(
              imageUrl
            );
          }
        }

        // =========================
        // VIDÉO
        // =========================

        let newVideo =
          property.video || null;

        /*
         * Une nouvelle vidéo
         * remplace l'ancienne.
         */

        if (video) {

          newVideo =
            await uploadToCloudinary(
              video
            );
        }

        // =========================
        // OBJET MIS À JOUR
        // =========================

        const updatedProperty = {

          ...property,

          transactionType,

          title,

          city,

          neighborhood,

          type,

          price,

          rooms,

          bathrooms,

          surface,

          surfaceUnit,

          documentType:

            isSale
              ? documentType
              : property.documentType ||
                "",

          description,

          owner: {
            ...property.owner,

            name,

            phone
          },

          images:
            newImages,

          image:
            newImages[0] || "",

          video:
            newVideo,

          // =========================
          // COURTE DURÉE
          // =========================

          pricePerNight:
            isShortStay
              ? pricePerNight
              : property.pricePerNight ||
                "",

          minNights:
            isShortStay
              ? minNights
              : property.minNights ||
                "",

          wifi:
            isShortStay
              ? wifi
              : property.wifi ||
                false,

          climatisation:
            isShortStay
              ? climatisation
              : property.climatisation ||
                false,

          cuisine:
            isShortStay
              ? cuisine
              : property.cuisine ||
                false,

          parking:
            isShortStay
              ? parking
              : property.parking ||
                false,

          piscine:
            isShortStay
              ? piscine
              : property.piscine ||
                false
        };

        console.log(
          "📝 MODIFICATION EN COURS :",
          updatedProperty
        );

        console.log(
          "🆔 ID DU BIEN :",
          id
        );

        await updateDoc(
          doc(
            db,
            "properties",
            id
          ),
          updatedProperty
        );

        console.log(
          "✅ BIEN MODIFIÉ AVEC SUCCÈS"
        );

        // =========================
        // MISE À JOUR LOCALE
        // =========================

        setProperties(
          (prev) =>
            prev.map(
              (item) =>
                item.firebaseId === id
                  ? {
                      ...item,
                      ...updatedProperty
                    }
                  : item
            )
        );

        navigate(
          "/mes-annonces"
        );

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

  // =========================
  // CHARGEMENT
  // =========================

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

  // =========================
  // AUTORISATION
  // =========================

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
              navigate(
                "/mes-annonces"
              )
            }
          >
            Retour à mes annonces
          </button>

        </section>

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
        title={
          isSale
            ? "Modifier mon bien | Logement221"
            : "Modifier mon logement | Logement221"
        }
        description="Modifiez les informations de votre annonce sur Logement221."
        url={`https://logement221.vercel.app/modifier-logement/${id}`}
        noindex={true}
      />

      <Navbar />

      <section className="add-property-section">

        <div className="add-property-box">

          <h1>
            {isSale
              ? "Modifier votre bien à vendre"
              : "Modifier votre logement"}
          </h1>

          <form
            className="add-property-form"
            onSubmit={
              handleSubmit
            }
          >

            {/* =========================
                TRANSACTION
            ========================= */}

            <select
              value={
                transactionType
              }
              onChange={
                handleTransactionChange
              }
              required
            >

              <option value="location">
                🏠 Location
              </option>

              <option value="vente">
                🏷️ Vente
              </option>

            </select>

            {/* =========================
                TITRE
            ========================= */}

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder={
                isSale
                  ? "Titre du bien à vendre"
                  : "Titre du logement"
              }
              required
            />

            {/* =========================
                VILLE
            ========================= */}

            <input
              type="text"
              value={city}
              onChange={(e) =>
                setCity(
                  e.target.value
                )
              }
              placeholder="Ville"
              required
            />

            {/* =========================
                QUARTIER
            ========================= */}

            <input
              type="text"
              value={neighborhood}
              onChange={(e) =>
                setNeighborhood(
                  e.target.value
                )
              }
              placeholder="Quartier / Localité"
              required
            />

            {/* =========================
                TYPE
            ========================= */}

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value
                )
              }
              required
            >

              {isSale ? (
                <>
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
                </>
              ) : (
                <>
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
                </>
              )}

            </select>

            {/* =========================
                INFORMATIONS TERRAIN
            ========================= */}

            {isSale &&
              isTerrain && (

                <div className="furnished-section">

                  <h3>
                    🌳 Informations sur le terrain
                  </h3>

                  <input
                    type="number"
                    value={surface}
                    onChange={(e) =>
                      setSurface(
                        e.target.value
                      )
                    }
                    placeholder="Superficie"
                    min="1"
                    required
                  />

                  <select
                    value={
                      surfaceUnit
                    }
                    onChange={(e) =>
                      setSurfaceUnit(
                        e.target.value
                      )
                    }
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
                    value={
                      documentType
                    }
                    onChange={(e) =>
                      setDocumentType(
                        e.target.value
                      )
                    }
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

            {/* =========================
                PRIX VENTE
            ========================= */}

            {isSale && (

              <input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value
                  )
                }
                placeholder="Prix de vente (FCFA)"
                min="1"
                required
              />

            )}

            {/* =========================
                MAISON / VILLA / APPARTEMENT VENTE
            ========================= */}

            {isSale &&
              !isTerrain && (
                <>

                  <input
                    type="number"
                    value={surface}
                    onChange={(e) =>
                      setSurface(
                        e.target.value
                      )
                    }
                    placeholder="Superficie"
                    min="1"
                    required
                  />

                  <select
                    value={
                      surfaceUnit
                    }
                    onChange={(e) =>
                      setSurfaceUnit(
                        e.target.value
                      )
                    }
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
                    value={rooms}
                    onChange={(e) =>
                      setRooms(
                        e.target.value
                      )
                    }
                    placeholder="Nombre de chambres"
                    min="0"
                    required
                  />

                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) =>
                      setBathrooms(
                        e.target.value
                      )
                    }
                    placeholder="Nombre de salles de bain"
                    min="0"
                    required
                  />

                  <select
                    value={
                      documentType
                    }
                    onChange={(e) =>
                      setDocumentType(
                        e.target.value
                      )
                    }
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

            {/* =========================
                LOCATION
            ========================= */}

            {!isSale && (
              <>

                {isShortStay && (

                  <div className="furnished-section">

                    <h3>
                      🏨 Informations pour la location courte durée
                    </h3>

                    <input
                      type="number"
                      value={
                        pricePerNight
                      }
                      onChange={(e) =>
                        setPricePerNight(
                          e.target.value
                        )
                      }
                      placeholder="Prix par nuit (FCFA)"
                      required
                    />

                    <input
                      type="number"
                      value={
                        minNights
                      }
                      onChange={(e) =>
                        setMinNights(
                          e.target.value
                        )
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
                          checked={
                            wifi
                          }
                          onChange={(e) =>
                            setWifi(
                              e.target.checked
                            )
                          }
                        />

                        📶 Wi-Fi

                      </label>

                      <label>

                        <input
                          type="checkbox"
                          checked={
                            climatisation
                          }
                          onChange={(e) =>
                            setClimatisation(
                              e.target.checked
                            )
                          }
                        />

                        ❄️ Climatisation

                      </label>

                      <label>

                        <input
                          type="checkbox"
                          checked={
                            cuisine
                          }
                          onChange={(e) =>
                            setCuisine(
                              e.target.checked
                            )
                          }
                        />

                        🍳 Cuisine équipée

                      </label>

                      <label>

                        <input
                          type="checkbox"
                          checked={
                            parking
                          }
                          onChange={(e) =>
                            setParking(
                              e.target.checked
                            )
                          }
                        />

                        🚗 Parking

                      </label>

                      {type ===
                        "Villa meublée" && (

                        <label>

                          <input
                            type="checkbox"
                            checked={
                              piscine
                            }
                            onChange={(e) =>
                              setPiscine(
                                e.target.checked
                              )
                            }
                          />

                          🏊 Piscine

                        </label>

                      )}

                    </div>

                  </div>
                )}

                <input
                  type="number"
                  value={
                    price
                  }
                  onChange={(e) =>
                    setPrice(
                      e.target.value
                    )
                  }
                  placeholder="Prix mensuel (FCFA)"
                  min="1"
                  required
                />

                <input
                  type="number"
                  value={
                    rooms
                  }
                  onChange={(e) =>
                    setRooms(
                      e.target.value
                    )
                  }
                  placeholder="Nombre de chambres"
                  required
                />

                <input
                  type="number"
                  value={
                    bathrooms
                  }
                  onChange={(e) =>
                    setBathrooms(
                      e.target.value
                    )
                  }
                  placeholder="Nombre de salles de bain"
                  required
                />

                <input
                  type="number"
                  value={
                    surface
                  }
                  onChange={(e) =>
                    setSurface(
                      e.target.value
                    )
                  }
                  placeholder="Superficie (m²)"
                  required
                />

              </>
            )}

            {/* =========================
                PROPRIÉTAIRE
            ========================= */}

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder={
                isSale
                  ? "Nom du propriétaire / vendeur"
                  : "Nom du propriétaire"
              }
              required
            />

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              placeholder={
                isSale
                  ? "Numéro du propriétaire / vendeur"
                  : "Numéro de téléphone"
              }
              required
            />

            {/* =========================
                PHOTOS
            ========================= */}

            <label>
              📸 Nouvelles photos
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {

                const selectedImages =
                  Array.from(
                    e.target.files
                  );

                if (
                  selectedImages.length >
                  10
                ) {

                  alert(
                    "Vous pouvez ajouter maximum 10 photos."
                  );

                  return;
                }

                setImages(
                  selectedImages
                );

              }}
            />

            {images.length > 0 && (

              <div className="images-preview">

                {images.map(
                  (
                    image,
                    index
                  ) => (

                    <div
                      className="image-preview-box"
                      key={index}
                    >

                      <img
                        src={URL.createObjectURL(
                          image
                        )}
                        alt={`Aperçu ${index + 1}`}
                        className="image-preview"
                      />

                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => {

                          setImages(
                            images.filter(
                              (_, i) =>
                                i !==
                                index
                            )
                          );

                        }}
                      >
                        ❌
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

            {/* =========================
                VIDÉO
            ========================= */}

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
                    50 *
                      1024 *
                      1024
                ) {

                  alert(
                    "La vidéo doit faire moins de 50 Mo."
                  );

                  return;
                }

                setVideo(
                  selectedVideo
                );

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
                    type={
                      video.type
                    }
                  />

                  Votre navigateur ne supporte pas la vidéo.

                </video>

              </div>

            )}

            {/* =========================
                DESCRIPTION
            ========================= */}

            <textarea
              value={
                description
              }
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder={
                isSale
                  ? "Description du bien : emplacement, environnement, accès, caractéristiques..."
                  : "Description du logement"
              }
              rows="5"
              required
            />

            <button type="submit">
              {isSale
                ? "Enregistrer les modifications du bien"
                : "Enregistrer les modifications"}
            </button>

          </form>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default ModifierLogement;