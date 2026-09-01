
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Listings from "../components/Listings";
import WhyChoose from "../components/WhyChoose";
import Stats from "../components/Stats";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
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