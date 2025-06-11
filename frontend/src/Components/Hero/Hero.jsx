import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, Users, ArrowRight } from 'lucide-react';
import './Hero.css'; // Link to standard CSS file

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-inner">
          <h2 className="hero-title">
            Transform Your <span className="highlight">Salon Business</span>
          </h2>
          <p className="hero-subtitle">
            The ultimate booking management platform that helps salons create stunning, 
            customizable booking pages and streamline their appointment system.
          </p>

          <div className="hero-cards">
            <div className="hero-card">
              <Calendar className="hero-icon" />
              <h3>Smart Booking</h3>
              <p>Automated scheduling with real-time availability</p>
            </div>
            <div className="hero-card">
              <Sparkles className="hero-icon" />
              <h3>Custom Pages</h3>
              <p>Personalized booking pages for your brand</p>
            </div>
            <div className="hero-card">
              <Users className="hero-icon" />
              <h3>Client Management</h3>
              <p>Keep track of your customers effortlessly</p>
            </div>
          </div>

          <div className="hero-buttons">
            <Link to="/signup" className="btn-primary">
              Start Your Free Trial <ArrowRight className="btn-icon" />
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign In to Dashboard
            </Link>
          </div>

          <div className="hero-footer">
            <p>Trusted by 500+ salons worldwide • No setup fees • Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
