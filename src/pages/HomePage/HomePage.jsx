import React from 'react';
import NavBar from "./NavBar/NavBar";
import HeroSection from "./HeroSection/HeroSection";
import FeatureSection from "./FeatureSection/FeatureSection";
import ContactButton from "./ContactButton/ContactButton";
import Footer from "./Footer/Footer";

function HomePage() {
  return (
    <div className="home">
      <NavBar />
      <HeroSection />
      <FeatureSection />
      <ContactButton />
      <Footer />
    </div>
  );
}

export default HomePage;
