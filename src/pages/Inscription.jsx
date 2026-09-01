import "../App.css";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../firebase";

import {
  doc,
  setDoc
} from "firebase/firestore";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../firebase";

function Inscription() {

  const auth = getAuth(app);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");


  const handleRegister = async (e) => {

    e.preventDefault();


    if(password !== confirmPassword){

      setMessage("Les mots de passe ne correspondent pas.");
      return;

    }


    try {

     const userCredential =
  await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

await setDoc(
  doc(db, "users", userCredential.user.uid),
  {
    uid: userCredential.user.uid,
    name,
    email,
    phone,
    favorites: []
  }
);


      setMessage("Compte créé avec succès ✅");


      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");


    } catch(error){

      setMessage(error.message);

    }

  };


  return (
    <>
      <Navbar />

      <section className="login-section">

        <div className="login-box">

          <h1>Créer un compte</h1>

          <p>
            Inscrivez-vous pour publier et gérer vos logements.
          </p>


          <form onSubmit={handleRegister}>


            <input 
              type="text"
              placeholder="Votre nom complet"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />


            <input 
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />


            <input 
              type="tel"
              placeholder="Votre numéro de téléphone"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
            />


            <input 
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />


            <input 
              type="password"
              placeholder="Confirmer votre mot de passe"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
            />


            <button type="submit">
              Créer mon compte
            </button>


            {message && (
              <p className="success-message">
                {message}
              </p>
            )}


          </form>

        </div>

      </section>


      <Footer />

    </>
  );
}

export default Inscription;