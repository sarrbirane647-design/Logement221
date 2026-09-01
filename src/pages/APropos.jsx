import "../App.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


function APropos() {

  return (

    <>

      <Navbar />


      <section className="about-section">


        <div className="about-container">


          <h1>
            À propos de Logement221
          </h1>


          <p className="about-intro">
            Logement221 est une plateforme sénégalaise qui facilite
            la recherche et la publication de logements partout au Sénégal.
          </p>



          <div className="about-cards">


            <div className="about-card">

              <h3>
                🏠 Notre mission
              </h3>

              <p>
                Notre objectif est de connecter facilement les personnes
                à la recherche d'un logement avec les propriétaires,
                dans une plateforme simple, rapide et fiable.
              </p>

            </div>



            <div className="about-card">

              <h3>
                🇸🇳 Notre vision
              </h3>

              <p>
                Construire la meilleure plateforme immobilière du Sénégal
                pour permettre à chacun de trouver son chez-soi plus facilement.
              </p>

            </div>



            <div className="about-card">

              <h3>
                🤝 Nos valeurs
              </h3>

              <p>
                Transparence, confiance et simplicité sont au cœur
                de notre manière de connecter locataires et propriétaires.
              </p>

            </div>



          </div>


<div className="about-bottom">

  <h2>
    Rejoignez Logement221 dès aujourd'hui
  </h2>

  <p>
    Que vous recherchiez un logement ou souhaitiez publier votre bien,
    Logement221 vous accompagne avec une plateforme simple, rapide et
    sécurisée partout au Sénégal.
  </p>

  <a href="/publier" className="about-btn">
    Publier un logement
  </a>

</div>
         

        </div>


      </section>


      <Footer />

    </>

  );

}


export default APropos;