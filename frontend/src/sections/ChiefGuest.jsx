import React from "react";
import "./ChiefGuest.css";
import ProfileCard from "../components/ProfileCard";

const ChiefGuest = ({ members }) => {
  return (
    <section className="committee-section" aria-label="Chief guests">
      <header className="committee-header" aria-label="Chief guests header">
        <h2 className="committee-title">Chief Guests</h2>
        <p className="committee-subtitle">Our esteemed dignitaries</p>
      </header>

      <div className="committee-container" aria-label="Chief guests list">
        {members.map((member) => (
          <ProfileCard
            key={member.name}
            name={member.name}
            role={member.designation}
            imageSrc={member.image}
            showSocials={false}
          />
        ))}
      </div>
    </section>
  );
};

export default ChiefGuest;
