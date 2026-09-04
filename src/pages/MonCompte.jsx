import "../App.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { UserContext } from "../context/UserContext";

import {
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import { auth, db } from "../firebase";

import {
  doc,
  getDoc
} from "firebase/firestore";


function MonCompte(){

const { user } = useContext(UserContext);

const navigate = useNavigate();

const [profile, setProfile] = useState(null);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordMessage, setPasswordMessage] = useState("");

useEffect(()=>{

const loadProfile = async()=>{


if(!user) return;


const userRef = doc(
  db,
  "users",
  user.uid
);


const snapshot = await getDoc(userRef);


if(snapshot.exists()){

console.log(
  "PROFILE COMPLET :",
  JSON.stringify(snapshot.data(), null, 2)
);

setProfile(snapshot.data());

}


};


loadProfile();


},[user]);

const logout = async()=>{

  await signOut(auth);

  navigate("/");

};

const handleChangePassword = async (e) => {

  e.preventDefault();

  setPasswordMessage("");

  if (!currentPassword || !newPassword || !confirmPassword) {
    setPasswordMessage("Veuillez remplir tous les champs.");
    return;
  }

  if (newPassword.length < 6) {
    setPasswordMessage(
      "Le nouveau mot de passe doit contenir au moins 6 caractères."
    );
    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordMessage(
      "Les nouveaux mots de passe ne correspondent pas."
    );
    return;
  }

  try {

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    await reauthenticateWithCredential(
      user,
      credential
    );

    await updatePassword(
      user,
      newPassword
    );

    setPasswordMessage(
      "Mot de passe modifié avec succès ✅"
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

  } catch (error) {

    console.error("ERREUR MODIFICATION MOT DE PASSE :", error);

    if (error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential") {

      setPasswordMessage(
        "Votre ancien mot de passe est incorrect."
      );

    } else {

      setPasswordMessage(
        "Impossible de modifier le mot de passe."
      );

    }

  }

};

if(!user){

return (

<>

<Navbar />

<section className="login-section">

<div className="login-box">

<h1>
Vous n'êtes pas connecté
</h1>

<p>
Connectez-vous pour accéder à votre compte.
</p>


<button
onClick={()=>navigate("/connexion")}
>
Se connecter
</button>


</div>

</section>


<Footer />

</>

);

}

if(!profile){

return (
<>
<Navbar />

<section className="login-section">
<div className="login-box">

<h2>
Chargement du profil...
</h2>

</div>
</section>

<Footer />
</>
);

}

return (

<>

<Navbar />


<section className="login-section">


<div className="login-box">


<h1>
👤 Mon compte
</h1>


<div className="profile-info">

<p>
👤 <strong>Nom :</strong>
<br/>
{profile?.name || "Non renseigné"}
</p>


<p>
📧 <strong>Email :</strong>
<br/>
{profile && profile.email
  ? profile.email
  : user.email}
</p>


<p>
📱 <strong>Téléphone :</strong>
<br/>
{profile && profile.phone
  ? profile.phone
  : "Non renseigné"}
</p>

</div>

<div className="password-change-section">

  <h2>
    🔐 Modifier le mot de passe
  </h2>

  <form onSubmit={handleChangePassword}>

    <input
      type="password"
      placeholder="Ancien mot de passe"
      value={currentPassword}
      onChange={(e) => setCurrentPassword(e.target.value)}
    />

    <input
      type="password"
      placeholder="Nouveau mot de passe"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />

    <input
      type="password"
      placeholder="Confirmer le nouveau mot de passe"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />

    <button
      type="submit"
      className="login-btn"
    >
      Modifier le mot de passe
    </button>

    {passwordMessage && (
      <p className="success-message">
        {passwordMessage}
      </p>
    )}

  </form>

</div>

<button
className="login-btn"
onClick={logout}
>

🚪 Déconnexion

</button>


</div>


</section>


<Footer />

</>

);


}


export default MonCompte;