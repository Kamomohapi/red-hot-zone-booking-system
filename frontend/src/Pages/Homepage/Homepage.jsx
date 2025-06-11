import React from 'react';
import Header from '../../Components/Header/Header';
import Hero from '../../Components/Hero/Hero';
import Features from '../../Components/Features/Features';
import './homepage.css'; // <-- Import the CSS file

const Homepage = () => {
  return (
    <div className="index-container">
      <Header />
      <Hero />
      <Features id = "features" />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-branding">
            <h3 className="footer-title">SalonHub</h3>
            <p className="footer-subtitle">
              Empowering salons with smart booking solutions
            </p>
          </div>
          <div className="footer-bottom">
            <p className="footer-note">
              © 2024 RedHotZone. All rights reserved. Made with ❤️ for the beauty industry.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
