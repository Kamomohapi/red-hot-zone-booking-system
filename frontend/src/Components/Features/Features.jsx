import React from 'react';
import { Palette, Share2, BarChart3, Clock, Shield, Smartphone } from 'lucide-react';
import './Features.css'; // standard CSS file

const Features = ({id}) => {
  const features = [
    {
      icon: Palette,
      title: "Complete Customization",
      description: "Design your booking page to match your salon's unique brand and style. Choose colors, upload images, and create a memorable experience."
    },
    {
      icon: Share2,
      title: "Shareable Public Links",
      description: "Get a unique booking link to share with clients across social media, websites, and marketing materials."
    },
    {
      icon: BarChart3,
      title: "Business Analytics",
      description: "Track bookings, revenue, and customer trends with comprehensive dashboard analytics."
    },
    {
      icon: Clock,
      title: "24/7 Online Booking",
      description: "Clients can book appointments anytime, even when your salon is closed, increasing your booking opportunities."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security ensures your business and customer data is always protected."
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Perfect booking experience on all devices - desktop, tablet, and mobile phones."
    }
  ];

  return (
    <section id = {id} className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2>
            Everything You Need to <span className="highlight">Succeed</span>
          </h2>
          <p>
            From booking management to customer relationships, SalonHub provides all the tools 
            modern salons need to thrive in today's competitive market.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <feature.icon className="icon" />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
