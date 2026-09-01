import { FiHome, FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col footer-brand">
          <h3 className="footer-logo">
            <FiHome /> logement221
          </h3>
          <p>Trouvez votre chez-vous au Sénégal.</p>
<div className="footer-socials">
  <a href="#" aria-label="Facebook"><FaFacebookF /></a>
  <a href="#" aria-label="Instagram"><FaInstagram /></a>
  <a href="#" aria-label="WhatsApp"><FaWhatsapp /></a>
  <a href="#" aria-label="Twitter"><FaTwitter /></a>
</div>
        </div>
        

        <div className="footer-col">
          <h4>Liens rapides</h4>
          <a href="#">Accueil</a>
          <a href="#">Logements</a>
          <a href="#">Publier une annonce</a>
          <a href="#">Contact</a>
        </div>

        <div className="footer-col">
          <h4>Catégories</h4>
          <a href="#">Appartements</a>
          <a href="#">Maisons</a>
          <a href="#">Chambres</a>
          <a href="#">Colocations</a>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <p><FiPhone /> 78 530 87 07</p>
          <p><FiMail /> contact@logement221.sn</p>
          <p><FiMapPin /> Dakar, Sénégal</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 logement221. Tous droits réservés.</p>
        <div className="footer-legal">
          <a href="#">Mentions légales</a>
          <a href="#">Confidentialité</a>
          <a href="#">Conditions d'utilisation</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;