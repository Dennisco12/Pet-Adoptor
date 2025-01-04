import React from "react";
import Header from "../../Components/Header/Header";
import FeaturedPets from "../../Components/FeaturedPets/FeaturedPets";
import Testimonials from "../../Components/Testimonials/Testimonials";
import "./Home.css";
import apiCalls from "../../api/baseData"
import { useState, useEffect } from "react"

const Home = () => {
  const [ pets, setPets ] = useState([]);
  useEffect(() => {
    apiCalls.get('/pets')
    .then(data => setPets(data))
  }, []);

  return (
    <div className="home">
      <Header />
      <section className="hero">
        <h1>Find Your Forever Friend</h1>
        <button className="cta-btn">Browse Pets</button>
      </section>
      <FeaturedPets pets={pets} />
      <Testimonials />
    </div>
  );
};

export default Home;

