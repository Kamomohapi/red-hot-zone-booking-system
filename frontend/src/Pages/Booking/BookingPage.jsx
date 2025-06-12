import  { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BookingPage.css";

const BookingPage = () => {
  const { slug } = useParams();
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    date: "",
    time_slot: "",
    service_type: "",
    salon_slug: slug || "", // Add salon_slug here
  });
  const [ selectedDate, setSelectedDate] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL  

  const services = [
    "Hair Cut", "Hair Color", "Hair Cut & Color", "Highlights",
    "Beard Trim", "Manicure", "Pedicure", "Facial", "Full Service Package"
  ];

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  const bookingData = { ...formData };

  try {
    await axios.post(`${apiBaseUrl}/api/api/create/booking`, bookingData);
    alert("Booking Submitted! We will contact you soon.");
    setFormData({
      client_name: "",
      client_email: "",
      client_phone: "",
      date: "",
      time_slot: "",
      service_type: "",
      salon_slug: slug || "", // Reset with slug
    });
    setSelectedDate("");
    setIsSubmitted(true);
  } catch (err) {
    console.error("Booking failed", err);
    alert("Failed to submit booking.");
  }finally{
    setIsLoading(false);
  }
};


  return (
   <div className="booking-outer">
  <div className="booking-banner">
    <h1>Welcome to Our Salon</h1>
    <p>We're excited to help you look and feel your best. Please fill out the form below to book your appointment.</p>
  </div>
  <div className="booking-container">
    <form onSubmit={handleSubmit} className="booking-form">
      <section className="section card">
        <h2>Personal Information</h2>
        <div className="input-row">
          <input
            type="text"
            name="client_name"
            placeholder="Full Name"
            value={formData.client_name}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="client_phone"
            placeholder="Phone Number"
            value={formData.client_phone}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="email"
          name="client_email"
          placeholder="Email Address"
          value={formData.client_email}
          onChange={handleChange}
          required
        />
      </section>

      <section className="section card">
        <h2>Service Selection</h2>
        <div className="options-grid">
          {services.map((service) => (
            <button
              type="button"
              key={service}
              className={formData.service_type === service ? "selected" : ""}
              onClick={() => setFormData((prev) => ({ ...prev, service_type: service }))}
            >
              {service}
            </button>
          ))}
        </div>
      </section>

      <section className="section card">
        <h2>Date & Time</h2>
        <div className="date-time-row">
          <input
            type="date"
            name="date"
            value={selectedDate || formData.date}
            onChange={handleChange}
            required
          />
          <div className="options-grid time-grid">
            {timeSlots.map((slot) => (
              <button
                type="button"
                key={slot}
                className={formData.time_slot === slot ? "selected" : ""}
                onClick={() => setFormData((prev) => ({ ...prev, time_slot: slot }))}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </section>

      <button
  type="submit"
  className="submit-btn"
  disabled={isSubmitted || isLoading}
>
  {isLoading ? (
    <span className="spinner"></span>
  ) : isSubmitted ? (
    "Submitted!"
  ) : (
    "Book Appointment"
  )}
</button>
    </form>
  </div>
</div>

  );
};

export default BookingPage;
