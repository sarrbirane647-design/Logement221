import "../App.css";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { PropertyContext } from "../context/PropertyContext";
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import {
  FaBed,
  FaBath,
  FaTrash,
  FaHome,
  FaTag
} from "react-icons/fa";
import { FiMaximize2 } from "react-icons/fi";
import { db } from "../firebase";

import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

function MesAnnonces() {

  const {
    properties,
    deleteProperty,
    updateProperty,
    loading,
    viewsCount,
    reviewsCount,
    reviewsAverage
  } = useContext(PropertyContext);

  const {
    user,
    loadingUser
  } = useContext(UserContext);

  const [showPremium, setShowPremium] =
    useState(false);

  const [selectedProperty, setSelectedProperty] =
    useState(null);

  const [selectedPlan, setSelectedPlan] =
    useState(null);

  const [showPayment, setShowPayment] =
    useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState(null);

  const premiumPlans = [
    {
      id: "7jours",
      name: "Premium 7 jours",
      duration: 7,
      price: 2000
    },
    {
      id: "15jours",
      name: "Premium 15 jours",
      duration: 15,
      price: 3500
    },
    {
      id: "30jours",
      name: "Premium 30 jours",
      duration: 30,
      price: 5000
    }
  ];

  const myProperties =
    properties.filter(
      (property) =>
        property.owner?.uid === user?.uid
    );

  const openPremium = (property) => {

    console.log(
      "PREMIUM CLIQUÉ :",
      property
    );

    setSelectedProperty(property);
    setSelectedPlan(null);
    setShowPremium(true);
  };

  const closePremium = () => {

    setShowPremium(false);
    setSelectedProperty(null);
    setSelectedPlan(null);
  };

  const continueToPayment = () => {

    if (
      !selectedPlan ||
      !selectedProperty
    ) {

      alert(
        "Veuillez sélectionner une formule Premium."
      );

      return;
    }

    setShowPayment(true);
  };

  const closePayment = () => {

    setShowPayment(false);
    setPaymentMethod(null);
  };

  // =========================
  // CHARGEMENT
  // =========================

  if (
    loading ||
    loadingUser
  ) {

    return (
      <>
        <Navbar />

        <h2 className="loading-message">
          Chargement de vos annonces...
        </h2>

        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO
        title="Mes annonces | Logement221"
        description="Gérez vos annonces de logements et de biens immobiliers, consultez vos statistiques et vos options Premium sur Logement221."
        url="https://logement221.vercel.app/mes-annonces"
        noindex={true}
      />

      <Navbar />

      <section className="listings">

        <div className="listings-header">

          <h2>
            Mes annonces
          </h2>

        </div>

        {/* =========================
            STATISTIQUES
        ========================= */}

        <div className="dashboard-stats">

          {/* TOTAL */}

          <div className="dashboard-card">

            <h3>
              {myProperties.length}
            </h3>

            <p>
              🏠 Mes annonces
            </p>

          </div>

          {/* AVIS */}

          <div className="dashboard-card">

            <h3>
              {myProperties.reduce(
                (
                  total,
                  property
                ) =>
                  total +
                  (
                    reviewsCount[
                      property.firebaseId
                    ] || 0
                  ),
                0
              )}
            </h3>

            <p>
              ⭐ Avis reçus
            </p>

          </div>

          {/* VENTES */}

          <div className="dashboard-card">

            <h3>
              {myProperties.filter(
                (property) =>
                  property.transactionType ===
                  "vente"
              ).length}
            </h3>

            <p>
              🏷️ Biens à vendre
            </p>

          </div>

          {/* LOCATIONS */}

          <div className="dashboard-card">

            <h3>
              {myProperties.filter(
                (property) =>
                  property.transactionType !==
                  "vente"
              ).length}
            </h3>

            <p>
              🏠 Biens à louer
            </p>

          </div>

        </div>

        {/* =========================
            AUCUNE ANNONCE
        ========================= */}

        {myProperties.length === 0 ? (

          <p className="no-properties">
            Vous n'avez publié aucune annonce.
          </p>

        ) : (

          <div className="listings-grid">

            {myProperties.map(
              (property) => {

                const isSale =
                  property.transactionType ===
                  "vente";

                const isTerrain =
                  property.type ===
                  "Terrain";

                const isShortStay =
                  [
                    "Appartement meublé",
                    "Villa meublée",
                    "Chambre meublée"
                  ].includes(
                    property.type
                  );

                // =========================
                // PRIX
                // =========================

                let priceText;

                if (isSale) {

                  priceText =
                    `${property.price || 0} FCFA`;

                } else if (isShortStay) {

                  priceText =
                    `${property.pricePerNight || 0} FCFA/nuit`;

                } else {

                  priceText =
                    `${property.price || 0} FCFA/mois`;
                }

                // =========================
                // TYPE DE BIEN
                // =========================

                const transactionLabel =
                  isSale
                    ? "🏷️ À vendre"
                    : "🏠 À louer";

                return (

                  <div
                    key={
                      property.firebaseId
                    }
                    className="listing-card"
                  >

                    {/* =========================
                        IMAGE
                    ========================= */}

                    <Link
                      to={`/property/${property.firebaseId}`}
                      className="listing-image-link"
                    >

                      <div
                        className="listing-image"
                        style={{
                          backgroundImage:
                            `url(${
                              property.images &&
                              property.images.length > 0
                                ? property.images[0]
                                : property.image
                            })`
                        }}
                      >

                        {/* PRIX */}

                        <span className="price-badge">

                          {priceText}

                        </span>

                        {/* TRANSACTION */}

                       <span
  className={
    isSale
      ? "transaction-badge sale-badge"
      : "transaction-badge rental-badge"
  }
>
  {isSale ? (
    <>
      <FaTag />
      À vendre
    </>
  ) : (
    <>
      <FaHome />
      À louer
    </>
  )}
</span>

                        {/* PREMIUM */}

                        {property.premium && (

                          <span
                            className="premium-badge"
                          >
                            ⭐ PREMIUM
                          </span>

                        )}

                        {/* STATUT */}

                        <span
                          className={`available-badge ${
                            property.status ===
                            "loue"
                              ? "status-rented"
                              : property.status ===
                                "attente"
                              ? "status-pending"
                              : "status-active"
                          }`}
                        >

                          {property.status ===
                          "loue"
                            ? isSale
                              ? "🔴 Vendu"
                              : "🔴 Loué"
                            : property.status ===
                              "attente"
                            ? "🟡 En attente"
                            : "🟢 Disponible"}

                        </span>

                      </div>

                    </Link>

                    {/* =========================
                        INFORMATIONS
                    ========================= */}

                    <div className="listing-info">

                      <Link
                        to={`/property/${property.firebaseId}`}
                        className="listing-info-link"
                      >

                        {/* TRANSACTION */}

                        <p className="location">

                          {transactionLabel}

                        </p>

                        {/* LOCALISATION */}

                        <p className="location">

                          📍 {property.city}

                          {property.neighborhood
                            ? ` • ${property.neighborhood}`
                            : ""}

                        </p>

                        {/* TITRE */}

                        <h3>

                          {property.title}

                        </h3>

                        {/* =========================
                            DETAILS
                        ========================= */}

                        <div
                          className="property-details"
                        >

                          {!isTerrain && (
                            <>
                              <span>

                                <FaBed />

                                {property.rooms ||
                                  0}{" "}
                                ch.

                              </span>

                              <span>

                                <FaBath />

                                {property.bathrooms ||
                                  0}{" "}
                                sdb.

                              </span>
                            </>
                          )}

                          {property.surface && (

                            <span>

                              <FiMaximize2 />

                              {property.surface}{" "}

                              {property.surfaceUnit ||
                                "m²"}

                            </span>

                          )}

                        </div>

                        {/* DOCUMENT VENTE */}

                        {isSale &&
                          property.documentType && (

                            <p className="location">

                              📄{" "}
                              {property.documentType}

                            </p>

                          )}

                      </Link>

                      {/* =========================
                          STATISTIQUES
                      ========================= */}

                      <div
                        className="property-stats"
                      >

                        <span>
                          👁️{" "}
                          {
                            viewsCount[
                              property.firebaseId
                            ] || 0
                          }{" "}
                          vues
                        </span>

                        <span>

                          ⭐{" "}
                          {
                            reviewsAverage[
                              property.firebaseId
                            ] || 0
                          }
                          /5{" "}

                          (
                          {
                            reviewsCount[
                              property.firebaseId
                            ] || 0
                          }{" "}
                          avis)

                        </span>

                        <span>

                          ❤️{" "}
                          {
                            property.favoritesCount ||
                            0
                          }{" "}
                          favoris

                        </span>

                      </div>

                      {/* =========================
                          PREMIUM
                      ========================= */}

                      {property.premium ? (

                        <div
                          className="premium-active-box"
                        >

                          <strong>
                            ⭐ Annonce Premium
                          </strong>

                          {property.premiumUntil && (

                            <small>

                              Jusqu'au{" "}

                              {
                                typeof property
                                  .premiumUntil
                                  .toDate ===
                                "function"

                                  ? property
                                      .premiumUntil
                                      .toDate()
                                      .toLocaleDateString(
                                        "fr-FR"
                                      )

                                  : new Date(
                                      property.premiumUntil
                                    ).toLocaleDateString(
                                      "fr-FR"
                                    )
                              }

                            </small>

                          )}

                        </div>

                      ) : (

                        <button
                          type="button"
                          className="premium-btn"
                          onClick={() =>
                            openPremium(
                              property
                            )
                          }
                        >

                          ⭐ Passer en Premium

                        </button>

                      )}

                      {/* =========================
                          VOIR LE BIEN
                      ========================= */}

                      <Link
                        to={`/property/${property.firebaseId}`}
                        className="details-btn"
                      >

                        {isSale
                          ? "Voir le bien"
                          : "Voir le logement"}

                      </Link>

                      {/* =========================
                          MODIFIER
                      ========================= */}

                      <Link
                        to={`/modifier-logement/${property.firebaseId}`}
                        className="edit-btn"
                      >

                        ✏️ Modifier

                      </Link>

                      {/* =========================
                          STATUT
                      ========================= */}

                      <button
                        className={
                          property.status ===
                          "loue"
                            ? "status-btn available"
                            : "status-btn rented"
                        }
                        onClick={() => {

                          const nouveauStatut =
                            property.status ===
                            "loue"
                              ? "active"
                              : "loue";

                          updateProperty(
                            property.firebaseId,
                            {
                              status:
                                nouveauStatut
                            }
                          );

                        }}
                      >

                        {property.status ===
                        "loue"

                          ? `🟢 Remettre ${
                              isSale
                                ? "en vente"
                                : "disponible"
                            }`

                          : `🔴 Marquer comme ${
                              isSale
                                ? "vendu"
                                : "loué"
                            }`}

                      </button>

                      {/* =========================
                          SUPPRIMER
                      ========================= */}

                      <button
                        className="delete-btn"
                        onClick={() => {

                          const confirmDelete =
                            window.confirm(
                              "Voulez-vous vraiment supprimer cette annonce ?"
                            );

                          if (
                            confirmDelete
                          ) {

                            deleteProperty(
                              property.firebaseId
                            );

                          }

                        }}
                      >

                        <FaTrash />

                        Supprimer

                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </section>

      {/* =========================
          MODALE PREMIUM
      ========================= */}

      {showPremium &&
        selectedProperty && (

          <div
            className="premium-modal-overlay"
            onClick={
              closePremium
            }
          >

            <div
              className="premium-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                type="button"
                className="premium-modal-close"
                onClick={
                  closePremium
                }
              >
                ×
              </button>

              <h2>
                ⭐ Mettre en Premium
              </h2>

              <p>
                Choisissez une formule pour mettre votre annonce en avant.
              </p>

              <h3 className="premium-property-title">
                {selectedProperty.title}
              </h3>

              <div className="premium-plans">

                {premiumPlans.map(
                  (plan) => (

                    <button
                      type="button"
                      key={plan.id}
                      className={`premium-plan ${
                        selectedPlan?.id ===
                        plan.id
                          ? "premium-plan-selected"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedPlan(
                          plan
                        )
                      }
                    >

                      <span className="premium-plan-name">
                        {plan.name}
                      </span>

                      <strong>
                        {plan.price.toLocaleString(
                          "fr-FR"
                        )}{" "}
                        FCFA
                      </strong>

                      <small>
                        Mise en avant pendant{" "}
                        {plan.duration}{" "}
                        jours
                      </small>

                    </button>

                  )
                )}

              </div>

              <button
                type="button"
                className="premium-payment-btn"
                onClick={
                  continueToPayment
                }
              >
                Continuer vers le paiement
              </button>

              <p className="premium-payment-info">

                🔒 Votre annonce ne sera Premium qu'après confirmation du paiement.

              </p>

            </div>

          </div>
        )}

      {/* =========================
          MODALE PAIEMENT
      ========================= */}

      {showPayment &&
        selectedProperty &&
        selectedPlan && (

          <div
            className="premium-modal-overlay"
            onClick={
              closePayment
            }
          >

            <div
              className="premium-modal payment-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                type="button"
                className="premium-modal-close"
                onClick={
                  closePayment
                }
              >
                ×
              </button>

              <h2>
                💳 Paiement Premium
              </h2>

              <p className="payment-choice-text">
                Vous avez choisi :
              </p>

              <h3 className="premium-property-title">
                {selectedPlan.name}
              </h3>

              <strong className="premium-payment-price">

                {selectedPlan.price.toLocaleString(
                  "fr-FR"
                )}{" "}
                FCFA

              </strong>

              <p className="payment-choice-text">

                Choisissez votre moyen de paiement :

              </p>

              {/* =========================
                  WAVE
              ========================= */}

              <div className="payment-methods">

                <button
                  type="button"
                  className={`payment-method wave-method ${
                    paymentMethod ===
                    "wave"
                      ? "payment-method-selected"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod(
                      "wave"
                    )
                  }
                >

                  <span className="payment-logo wave-logo">
                    W
                  </span>

                  <span className="payment-method-info">

                    <strong>
                      Wave
                    </strong>

                    <small>
                      Paiement mobile
                    </small>

                  </span>

                  {paymentMethod ===
                    "wave" && (

                    <span className="payment-check">
                      ✓
                    </span>

                  )}

                </button>

                {/* ORANGE MONEY */}

                <button
                  type="button"
                  className={`payment-method orange-method ${
                    paymentMethod ===
                    "orange-money"
                      ? "payment-method-selected"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod(
                      "orange-money"
                    )
                  }
                >

                  <span className="payment-logo orange-logo">
                    OM
                  </span>

                  <span className="payment-method-info">

                    <strong>
                      Orange Money
                    </strong>

                    <small>
                      Paiement mobile
                    </small>

                  </span>

                  {paymentMethod ===
                    "orange-money" && (

                    <span className="payment-check">
                      ✓
                    </span>

                  )}

                </button>

              </div>

              {/* MOYEN SÉLECTIONNÉ */}

              {paymentMethod && (

                <div className="selected-payment-message">

                  ✓ Vous avez sélectionné{" "}

                  <strong>

                    {paymentMethod ===
                    "wave"
                      ? "Wave"
                      : "Orange Money"}

                  </strong>

                </div>

              )}

              {/* PAIEMENT */}

              <button
                type="button"
                className="premium-payment-btn"
                disabled={
                  !paymentMethod
                }
                onClick={async () => {

                  if (
                    !paymentMethod
                  ) {

                    alert(
                      "Veuillez choisir un moyen de paiement."
                    );

                    return;
                  }

                  try {

                    await addDoc(
                      collection(
                        db,
                        "premiumPayments"
                      ),
                      {

                        propertyId:
                          selectedProperty.firebaseId,

                        propertyTitle:
                          selectedProperty.title,

                        ownerId:
                          user?.uid ||
                          null,

                        planId:
                          selectedPlan.id,

                        planName:
                          selectedPlan.name,

                        duration:
                          selectedPlan.duration,

                        amount:
                          selectedPlan.price,

                        paymentMethod:
                          paymentMethod,

                        status:
                          "pending",

                        createdAt:
                          serverTimestamp()

                      }
                    );

                    const paymentName =
                      paymentMethod ===
                      "wave"
                        ? "Wave"
                        : "Orange Money";

                    alert(
                      `✅ Votre demande de paiement a été enregistrée.\n\n` +
                      `Moyen choisi : ${paymentName}\n` +
                      `Montant : ${selectedPlan.price.toLocaleString(
                        "fr-FR"
                      )} FCFA\n\n` +
                      `Le paiement réel sera disponible dès que ${paymentName} sera connecté.`
                    );

                    setShowPayment(
                      false
                    );

                    setShowPremium(
                      false
                    );

                    setPaymentMethod(
                      null
                    );

                    setSelectedPlan(
                      null
                    );

                  } catch (
                    error
                  ) {

                    console.error(
                      "Erreur création paiement Premium :",
                      error
                    );

                    alert(
                      "❌ Une erreur est survenue. Veuillez réessayer."
                    );

                  }

                }}
              >

                Payer{" "}

                {selectedPlan.price.toLocaleString(
                  "fr-FR"
                )}{" "}
                FCFA

              </button>

              <p className="premium-payment-info">

                🔒 Votre annonce sera activée en Premium uniquement après confirmation du paiement.

              </p>

            </div>

          </div>

        )}

      <Footer />

    </>
  );
}

export default MesAnnonces;