import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Logements from "./pages/Logements";
import Publier from "./pages/Publier";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import AjouterLogement from "./pages/AjouterLogement";
import PropertyDetails from "./pages/PropertyDetails";
import ModifierLogement from "./pages/ModifierLogement";
import MesAnnonces from "./pages/MesAnnonces";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import Favoris from "./pages/Favoris";
import MonCompte from "./pages/MonCompte";

function App() {

  return (

    <Routes>

      <Route 
        path="/" 
        element={<Home />} 
      />

      <Route 
        path="/logements" 
        element={<Logements />} 
      />

      <Route 
        path="/publier" 
        element={<Publier />} 
      />

      <Route 
        path="/connexion" 
        element={<Connexion />} 
      />

      <Route 
        path="/inscription" 
        element={<Inscription />} 
      />

      <Route 
        path="/ajouter-logement" 
        element={<AjouterLogement />} 
      />

      <Route 
        path="/property/:id" 
        element={<PropertyDetails />} 
      />

      <Route 
 path="/modifier-logement/:id" 
 element={<ModifierLogement />}
/>


      <Route 
        path="/mes-annonces" 
        element={<MesAnnonces />} 
      />

      <Route 
        path="/a-propos" 
        element={<APropos />} 
      />

<Route 
  path="/contact" 
  element={<Contact />} 
/>

<Route
  path="/favoris"
  element={<Favoris />}
/>


<Route 
path="/mon-compte" 
element={<MonCompte />}
/>

    </Routes>

  );
}

export default App;