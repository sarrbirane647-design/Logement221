import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";

import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
  increment
} from "firebase/firestore";


export const UserContext = createContext();


export function UserProvider({ children }) {


  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
const [loadingUser, setLoadingUser] = useState(true);


  useEffect(() => {


    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {


        setUser(currentUser);


        if(currentUser){


          const userRef = doc(
            db,
            "users",
            currentUser.uid
          );


          const userSnap = await getDoc(userRef);


          if(userSnap.exists()){

            setFavorites(
              userSnap.data().favorites || []
            );

          }

          setLoadingUser(false);

        } else {

          setFavorites([]);
setLoadingUser(false);
        }


      }
    );


    return () => unsubscribe();


  }, []);




  const addFavorite = async (property) => {


    if(!user) return;


    const userRef = doc(
      db,
      "users",
      user.uid
    );


    await updateDoc(
  userRef,
  {
    favorites: arrayUnion(property)
  }
).catch(async () => {

  await setDoc(
    userRef,
    {
      favorites: [property]
    }
  );

});

try {

  await updateDoc(
    doc(db,"properties",property.firebaseId),
    {
      favoritesCount: increment(1)
    }
  );

} catch(error){

  console.log("Erreur compteur favoris :", error);

}

    setFavorites([
      ...favorites,
      property
    ]);

  };





  const removeFavorite = async (property) => {


    if(!user) return;


    const userRef = doc(
      db,
      "users",
      user.uid
    );


    await updateDoc(
      userRef,
      {
        favorites: arrayRemove(property)
      }
    );

try {

  await updateDoc(
    doc(db,"properties",property.firebaseId),
    {
      favoritesCount: increment(-1)
    }
  );

} catch(error){

  console.log("Erreur compteur favoris :", error);

}

    setFavorites(
      favorites.filter(
        item => item.firebaseId !== property.firebaseId
      )
    );

  };




  return (

    <UserContext.Provider
value={{
  user,
  favorites,
  addFavorite,
  removeFavorite,
  loadingUser
}}

    >

      {children}

    </UserContext.Provider>

  );


}