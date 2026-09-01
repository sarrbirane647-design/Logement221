import "../App.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Publier() {
  return (
    <>
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