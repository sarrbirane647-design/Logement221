import "../App.css";
import { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

import { UserContext } from "../context/UserContext";


function Connexion() {

  const { user } = useContext(UserContext);

  const navigate = useNavigate();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");



  const handleLogin = async (e) => {

    e.preventDefault();


    if(!email || !password){

      setMessage("Veuillez remplir tous les champs.");
      return;

    }


    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );


      setMessage("Connexion réussie ✅");


      setTimeout(() => {

        navigate("/");

      },1500);



    } catch(error){

      setMessage("Email ou mot de passe incorrect ❌");

    }

  };



  return (
    <>

      <Navbar />


      <section className="login-section">

        <div className="login-box">


          <h1>
            Connexion
          </h1>


          <p>
            Connectez-vous pour gérer vos annonces de logement.
          </p>



          <form onSubmit={handleLogin}>


            <input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />


            <input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />


            <button type="submit">
              Se connecter
            </button>



            {message && (

              <p className="success-message">
                {message}
              </p>

            )}



            <div className="login-links">

              <a href="#">
                Mot de passe oublié ?
              </a>


              <p>
                Vous n’avez pas de compte ?
                <Link to="/inscription">
                  Créer un compte
                </Link>
              </p>


            </div>


          </form>


        </div>

      </section>


      <Footer />

    </>
  );
}


export default Connexion;