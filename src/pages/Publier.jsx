import "../App.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

function Publier() {
  return (
    <>
    <SEO
  title="Publier un logement au Sénégal | Logement221"
  description="Publiez gratuitement votre annonce de logement sur Logement221 et trouvez rapidement des locataires au Sénégal."
  url="https://logement221.vercel.app/publier"
/>
      <Navbar />

      <section className="publish-section">
        <h1>Publier une annonce</h1>
        <p>
          Ajoutez votre logement et trouvez rapidement des locataires.
        </p>

        <Link
  to="/ajouter-logement"
  className="start-btn"
  translate="no"
>
  Commencer
</Link>
      </section>

      <Footer />
    </>
  );
}

export default Publier;