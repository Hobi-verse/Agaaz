import React from "react";
import "./Banner.css";

const Banner = () => {
  return (
    <a
      href="https://www.google.com/maps/place/Main+play-ground,+Second+campus,+University+of+Lucknow/@26.9226332,80.946497,14.92z/data=!4m6!3m5!1s0x3999572a9f2b2ded:0x9966e75a63551637!8m2!3d26.9237233!4d80.9397927!16s%2Fg%2F11jnsycfd5"
      target="_blank"
      rel="noopener noreferrer"
      className="banner"
    >
      <span className="banner-text">
        📍 Venue: 2nd Campus, Lucknow University — Click to open Google Maps
      </span>
    </a>
  );
};

export default Banner;
