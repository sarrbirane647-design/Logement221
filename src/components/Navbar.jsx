import { NavLink, Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

function Navbar() {
const { user } = useContext(UserContext);

  const [menuOpen, setMenuOpen] = useState(false);



  return (
    <header className="navbar">

      <div className="logo-group">

        <div className="logo-row">

          <svg
            className="logo-icon"
            viewBox="0 0 48 48"
            width="38"
            height="38"
            fill="none"
          >

            <path
              d="M6 22L24 7L42 22"
              stroke="#1a8c3f"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M11 20V40H37V20"
              stroke="#1a8c3f"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            <path
              d="M20 40V29H28V40"
              stroke="#1a8c3f"
              strokeWidth="4"
            />

            <circle
              cx="24"
              cy="8"
              r="3"
              fill="#F5A623"
            />

          </svg>


          <p className="logo-title">
            logement<span className="logo-title-accent">221</span>
          </p>

        </div>


        <p className="tagline">
          Trouvez votre chez-vous au Sénégal
        </p>

      </div>
<button 
 className="menu-toggle"
 onClick={()=>setMenuOpen(!menuOpen)}
>
 {menuOpen ? "✕" : "☰"}
</button>

<nav className={menuOpen ? "open" : ""}>

        <NavLink
          to="/"
          onClick={()=>setMenuOpen(false)}
          className={({isActive}) => isActive ? "active" : ""}
        >
          Accueil
        </NavLink>


        <NavLink
          to="/logements"
          onClick={()=>setMenuOpen(false)}
          className={({isActive}) => isActive ? "active" : ""}
        >
          Logements
        </NavLink>



        <NavLink
          to="/mes-annonces"
          onClick={()=>setMenuOpen(false)}
          className={({isActive}) => isActive ? "active" : ""}
        >
          Mes annonces
        </NavLink>

<NavLink
  to="/favoris"
  onClick={()=>setMenuOpen(false)}
  className={({ isActive }) => (isActive ? "active" : "")}
>
  ❤️ Favoris
</NavLink>

        <NavLink
          to="/a-propos"
          onClick={()=>setMenuOpen(false)}
          className={({isActive}) => isActive ? "active" : ""}
        >
          À propos
        </NavLink>


        <NavLink
          to="/contact"
          onClick={()=>setMenuOpen(false)}
          className={({isActive}) => isActive ? "active" : ""}
        >
          Contact
        </NavLink>

      </nav>



     <div className="nav-actions">


{user ? (

  <>

    <Link
      to="/mon-compte"
      className="login-btn"
      onClick={()=>setMenuOpen(false)}
    >
      👤 Mon compte
    </Link>


  </>

) : (

  <Link
    to="/connexion"
    className="login-btn"
    translate="no"
  >
    Connexion
  </Link>

)}



<Link
  to="/publier"
  className="publish-btn-nav"
  translate="no"
>
  PUBLIER
</Link>


</div>


    </header>
  );
}

export default Navbar;