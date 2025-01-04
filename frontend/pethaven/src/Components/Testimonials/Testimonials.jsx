import React from "react";
import "./Testimonials.css";

const Testimonials = () => {
  const testimonials = [
    { user: "John Doe", review: "PetHaven made adopting my dog so easy!" },
    { user: "Jane Smith", review: "The best platform for pet adoption!" },
  ];

  return (
    <section id="testimonials" className="testimonials">
      <h2>What Our Users Say</h2>
      <div className="testimonials-list">
        {testimonials.map((testimonial, index) => (
          <div className="testimonial" key={index}>
            <p>"{testimonial.review}"</p>
            <h4>- {testimonial.user}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;

