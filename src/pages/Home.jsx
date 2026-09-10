
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Listings from "../components/Listings";
import WhyChoose from "../components/WhyChoose";
import Stats from "../components/Stats";
import Footer from "../components/Footer";
import SEO from "../components/SEO";


function Home() {
  return (
    <>
    <SEO
  title="Logement221 — Trouvez votre logement idéal au Sénégal"
  description="Logement221 vous aide à trouver facilement des logements à louer au Sénégal : appartements, maisons, chambres, colocations et séjours courte durée."
  url="https://logement221.vercel.app/"
/>
      <Navbar />
      <Hero />
      <Categories />
      <section id="logements">
        <Listings />
      </section>
      <WhyChoose />
      <Stats />
      <Footer />
    </>
  );
}

export default Home;