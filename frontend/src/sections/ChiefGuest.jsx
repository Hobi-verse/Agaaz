import React from "react";
import "./ChiefGuest.css";

const ChiefGuest = ({ members }) => {
  return (
    <section className="committee-section">
      <div className="committee-container">
        {members.map((member, index) => (
          <div key={index} className="committee-card">
            <div className="image-wrapper">
              <img src={member.image} alt={member.name} />
            </div>

            <h3>{member.name}</h3>
            <p className="designation">{member.designation}</p>
            <p className="role">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChiefGuest;
