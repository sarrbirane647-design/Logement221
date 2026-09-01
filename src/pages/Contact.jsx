import "../App.css";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../firebase";

import {
  collection,
  addDoc
} from "firebase/firestore";

function Contact() {


const [formData, setFormData] = useState({
  name: "",
  email: "",
  message: ""
});

const [success, setSuccess] = useState(false);
const handleSubmit = async (e) => {

alert("La fonction démarre");

  e.preventDefault();

  
  try {

    await addDoc(
      collection(db, "messages"),
      {
        ...formData,
        createdAt: new Date().toISOString(),
        status: "nouveau"
      }
    );


    setSuccess(true);


    setFormData({
      name: "",
      email: "",
      message: ""
    });


  } catch(error){

    console.error(
      "Erreur envoi message :",
      error
    );

  }

};

  return (
    <>
      <Navbar />

      <section className="contact-section">

        <div className="contact-container">

          <h1>Contactez-nous</h1>

          <p className="contact-intro">
            Une question ? Une suggestion ? Besoin d'aide ?
            Notre équipe est à votre écoute.
          </p>

          <div className="contact-content">

            <div className="contact-info">

              <div className="contact-item">
                <h3>📍 Adresse</h3>
                <p>Dakar, Sénégal</p>
              </div>

              <div className="contact-item">
                <h3>📞 Téléphone</h3>
                <p>+221 XX XXX XX XX</p>
              </div>

              <div className="contact-item">
                <h3>📧 Email</h3>
                <p>contact@logement221.com</p>
              </div>

            </div>

{success && (
  <p className="success-message">
    Votre message a bien été envoyé ✅
  </p>
)}

           <form 
  className="contact-form"
  onSubmit={handleSubmit}
>
<input
 type="text"
 placeholder="Votre nom"
 value={formData.name}
 onChange={(e)=>setFormData({
   ...formData,
   name:e.target.value
 })}
/>
             <input
 type="email"
 placeholder="Votre email"
 value={formData.email}
 onChange={(e)=>setFormData({
   ...formData,
   email:e.target.value
 })}
/>
<textarea
 rows="6"
 placeholder="Votre message"
 value={formData.message}
 onChange={(e)=>setFormData({
   ...formData,
   message:e.target.value
 })}
/>
<button 
  type="submit"
>
  Envoyer le message
</button>

            </form>

          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default Contact;