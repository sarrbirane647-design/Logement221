import "../App.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { UserContext } from "../context/UserContext";

import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";

import {
  doc,
  getDoc
} from "firebase/firestore";


function MonCompte(){

const { user } = useContext(UserContext);

const navigate = useNavigate();

const [profile, setProfile] = useState(null);


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