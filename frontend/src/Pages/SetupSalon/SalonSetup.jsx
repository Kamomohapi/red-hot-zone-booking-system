import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {jwtDecode} from "jwt-decode";
import "./SalonSetup.css";

const SalonSetup = () => {
  const navigate = useNavigate();
  const [salonData, setSalonData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    operatingHours: {
      Monday: { opening: null, closing: null },
      Tuesday: { opening: null, closing: null },
      Wednesday: { opening: null, closing: null },
      Thursday: { opening: null, closing: null },
      Friday: { opening: null, closing: null },
      Saturday: { opening: null, closing: null },
      Sunday: { opening: null, closing: null },
    },
  });
  const [services, setServices] = useState([
    { name: "", duration: "", price: "" }])

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found.");
      return;
    }
      let userId = null;
  try {
    const decoded = jwtDecode(token);
    userId = decoded.user_id || decoded.sub || decoded.id || decoded.uid;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return;
  }
    const formattedOperatingHours = Object.entries(salonData.operatingHours).map(
      ([day, times]) => ({
        day,
        open_time: times.opening
          ? times.opening.toISOString().substring(11, 16)
          : null,
        close_time: times.closing
          ? times.closing.toISOString().substring(11, 16)
          : null,
      })
    );

    // ("Payload being sent:", {
    //   name: salonData.name,
    //   address: salonData.address,
    //   phone_number: salonData.phoneNumber,
    //   email: salonData.email,
    //   user_id: userId,
    //   operating_hours: formattedOperatingHours,
    // });

    try {
      await axios.post(
        `${apiBaseUrl}/api/create/salon`,
        {
          name: salonData.name,
          address: salonData.address,
          phone_number: salonData.phoneNumber,
          email: salonData.email,
          user_id: userId,
          operating_hours: formattedOperatingHours,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await axios.post(
  `${apiBaseUrl}/api/create_service`,
  {
    name: services.name,
    duration: services.duration,
    price: services.price,
    is_active: true
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to create salon:", error.response?.data || error.message);
    }
  };

  

  
  const handleTimeChange = (day, type, value) => {
    setSalonData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [type]: value,
        },
      },
    }));
  };

  return (
    <div className="salon-setup-container">
      <form className="salon-setup-form" onSubmit={handleSubmit}>
        <h2>Setup Your Salon</h2>

        <input
          type="text"
          placeholder="Salon Name"
          value={salonData.name}
          required
          onChange={(e) => setSalonData({ ...salonData, name: e.target.value })}
        />

        <input
          type="text"
          placeholder="Address"
          value={salonData.address}
          required
          onChange={(e) => setSalonData({ ...salonData, address: e.target.value })}
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={salonData.phoneNumber}
          required
          onChange={(e) => setSalonData({ ...salonData, phoneNumber: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          value={salonData.email}
          required
          onChange={(e) => setSalonData({ ...salonData, email: e.target.value })}
        />

        <div className="operating-hours-section">
          <h3>Operating Hours</h3>
          <div className="operating-hours-grid">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <div className="operating-hours-row" key={day}>
                <label>{day}</label>
                <DatePicker
                  selected={salonData.operatingHours[day]?.opening || null}
                  onChange={(date) => handleTimeChange(day, "opening", date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Opening"
                  dateFormat="HH:mm"
                />

                <DatePicker
                  selected={salonData.operatingHours[day]?.closing || null}
                  onChange={(date) => handleTimeChange(day, "closing", date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Closing"
                  dateFormat="HH:mm"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="services-section">
          <h3>Services</h3>
          {services.map((service, index) => (
            <div className="service-row" key={index}>
              <input
                type="text"
                placeholder="Service Name"
                value={service.name}
                onChange={(e) => {
                  const newServices = [...services];
                  newServices[index].name = e.target.value;
                  setServices(newServices);
                }}
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={service.duration}
                onChange={(e) => {
                  const newServices = [...services];
                  newServices[index].duration = parseInt(e.target.value, 10);
                  setServices(newServices);
                }}
              />
              <input
                type="number"
                placeholder="Price"
                value={service.price}
                onChange={(e) => {
                  const newServices = [...services];
                  newServices[index].price = parseFloat(e.target.value);
                  setServices(newServices);
                }}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setServices([...services, { name: "", duration: "", price:"R " }])}
          >
            Add Service
          </button>

        </div>

        <button type="submit">Finish Setup</button>
      </form>
    </div>
  );
};

export default SalonSetup;
