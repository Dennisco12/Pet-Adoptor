import React from "react";
import "./FeaturedPets.css";

const FeaturedPets = ({ pets }) => {
  /* const pets = [
    { name: "Buddy", type: "Dog", image: "/images/dog1.jpg" },
    { name: "Mittens", type: "Cat", image: "/images/cat1.jpg" },
  ]; */

  return (
    <section id="featured" className="featured-pets">
      <h2>Featured Pets</h2>
      <div className="pets-list">
        {pets.map((pet, index) => (
          <div className="pet-card" key={index}>
            <img src={pet.image} alt={pet.name} />
            <h3>{pet.name}</h3>
            <p>{pet.type}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedPets;

