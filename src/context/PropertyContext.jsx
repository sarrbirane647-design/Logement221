import { createContext, useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  Timestamp
} from "firebase/firestore";
export const PropertyContext = createContext();
export function PropertyProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [viewsCount, setViewsCount] = useState({});
  const [reviewsCount, setReviewsCount] = useState({});
  const [reviewsAverage, setReviewsAverage] = useState({});
  const [loading, setLoading] = useState(true);
  // ================================
  // 🏠 ÉCOUTER LES LOGEMENTS EN TEMPS RÉEL
  // ================================
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "properties"),
      async (snapshot) => {
        try {
          const now = new Date();
          const data = await Promise.all(
            snapshot.docs.map(async (document) => {
              const property = {
                firebaseId: document.id,
                ...document.data()
              };
              // ================================
              // ⭐ GESTION PREMIUM
              // ================================
              if (property.premium === true) {
                let premiumUntilDate = null;
                // Firebase Timestamp
                if (
                  property.premiumUntil &&
                  typeof property.premiumUntil.toDate === "function"
                ) {
                  premiumUntilDate =
                    property.premiumUntil.toDate();
                }
                // Date enregistrée en texte
                else if (property.premiumUntil) {
                  const parsedDate = new Date(
                    property.premiumUntil
                  );
                  if (!isNaN(parsedDate.getTime())) {
                    premiumUntilDate = parsedDate;
                  }
                }
                // ================================
                // ⏰ PREMIUM EXPIRÉ
                // ================================
                if (
                  premiumUntilDate &&
                  premiumUntilDate <= now
                ) {
                  console.log(
                    "⏰ PREMIUM EXPIRÉ :",
                    property.title
                  );
                  const expiredData = {
                    premium: false,
                    premiumUntil: null,
                    premiumPlan: null,
                    premiumDuration: null,
                    premiumPrice: null
                  };
                  await updateDoc(
                    doc(
                      db,
                      "properties",
                      document.id
                    ),
                    expiredData
                  );
                  return {
                    ...property,
                    ...expiredData
                  };
                }
                // ================================
                // ⭐ PREMIUM ENCORE ACTIF
                // ================================
                if (premiumUntilDate) {
                  return {
                    ...property,
                    premiumUntil: premiumUntilDate
                  };
                }
              }
              return property;
            })
          );
          setProperties(data);
          setLoading(false);
        } catch (error) {
          console.error(
            "Erreur traitement logements Firebase :",
            error
          );
          setLoading(false);
        }
      },
      (error) => {
        console.error(
          "Erreur écoute logements Firebase :",
          error
        );
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);
  // ================================
  // ⭐ ÉCOUTER LES AVIS EN TEMPS RÉEL
  // ================================
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "reviews"),
      (snapshot) => {
        const counts = {};
        const ratings = {};
        snapshot.docs.forEach((document) => {
          const review = document.data();
          const propertyId = review.propertyId;
          if (!propertyId) return;
          counts[propertyId] =
            (counts[propertyId] || 0) + 1;
          ratings[propertyId] =
            (ratings[propertyId] || 0) +
            Number(review.rating || 0);
        });
        const averages = {};
        Object.keys(ratings).forEach((propertyId) => {
          averages[propertyId] = (
            ratings[propertyId] /
            counts[propertyId]
          ).toFixed(1);
        });
        setReviewsCount(counts);
        setReviewsAverage(averages);
        console.log(
          "📡 AVIS GLOBAUX :",
          counts
        );
      },
      (error) => {
        console.error(
          "Erreur écoute avis Firebase :",
          error
        );
      }
    );
    return () => unsubscribe();
  }, []);
  // ================================
  // 👁️ ÉCOUTER LES VUES EN TEMPS RÉEL
  // ================================
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "views"),
      (snapshot) => {
        const counts = {};
        snapshot.docs.forEach((document) => {
          const view = document.data();
          const propertyId = view.propertyId;
          if (!propertyId) return;
          counts[propertyId] =
            (counts[propertyId] || 0) + 1;
        });
        setViewsCount(counts);
        console.log(
          "📡 VUES GLOBALES :",
          counts
        );
      },
      (error) => {
        console.error(
          "Erreur écoute vues Firebase :",
          error
        );
      }
    );
    return () => unsubscribe();
  }, []);
  // ================================
  // 🗑️ SUPPRIMER UNE ANNONCE
  // ================================
  const deleteProperty = async (id) => {
    try {
      await deleteDoc(
        doc(db, "properties", id)
      );
      setProperties((prev) =>
        prev.filter(
          (property) =>
            property.firebaseId !== id
        )
      );
    } catch (error) {
      console.error(
        "Erreur suppression :",
        error
      );
    }
  };
  // ================================
  // ⭐ ACTIVER PREMIUM
  // ================================
  const activatePremium = async (
    propertyId,
    plan
  ) => {
    try {
      const premiumUntil = new Date();
      premiumUntil.setDate(
        premiumUntil.getDate() +
        plan.duration
      );
      const premiumData = {
        premium: true,
        premiumUntil:
          Timestamp.fromDate(
            premiumUntil
          ),
        premiumPlan: plan.id,
        premiumDuration: plan.duration,
        premiumPrice: plan.price
      };
      const propertyRef = doc(
        db,
        "properties",
        propertyId
      );
      await updateDoc(
        propertyRef,
        premiumData
      );
      setProperties((prev) =>
        prev.map((property) =>
          property.firebaseId === propertyId
            ? {
                ...property,
                ...premiumData
              }
            : property
        )
      );
      console.log(
        "⭐ PREMIUM ACTIVÉ :",
        propertyId,
        premiumData
      );
      return true;
    } catch (error) {
      console.error(
        "Erreur activation Premium :",
        error
      );
      return false;
    }
  };
  // ================================
  // ✏️ MODIFIER UNE ANNONCE
  // ================================
  const updateProperty = async (
    id,
    data
  ) => {
    try {
      const propertyRef = doc(
        db,
        "properties",
        id
      );
      await updateDoc(
        propertyRef,
        data
      );
      setProperties((prev) =>
        prev.map((property) =>
          property.firebaseId === id
            ? {
                ...property,
                ...data
              }
            : property
        )
      );
    } catch (error) {
      console.error(
        "Erreur modification logement :",
        error
      );
    }
  };
  // ================================
  // 🔄 RECHARGEMENT
  // ================================
  const reloadProperties = () => {
    console.log(
      "📡 Les logements sont synchronisés en temps réel."
    );
  };
  // ================================
  // CONTEXT
  // ================================
  return (
    <PropertyContext.Provider
      value={{
        properties,
        setProperties,
        deleteProperty,
        updateProperty,
        activatePremium,
        loading,
        reloadProperties,
        viewsCount,
        reviewsCount,
        reviewsAverage
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}