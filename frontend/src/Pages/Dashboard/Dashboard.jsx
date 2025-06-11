import React, { useState, useEffect} from "react";
import {
  BarChart3,
  Calendar,
  Users,
  Settings,
  Link as LinkIcon,
  Copy,
  Scissors,
  Plus,
  Eye,
  Edit
} from "lucide-react";
import "./Dashboard.css";
import axios from "axios";

const Dashboard = () => {

 const [salonInfo, setSalonInfo] = useState(null);
 const [error, setError] = useState(null);
 const[bookingInfo, setBookingInfo] = useState([]);
 const [bookingTodayInfo, setBookingTodayInfo] = useState([]);
 const apiBaseUrl = process.env.REACT_APP_API_BASE_URL 

    useEffect(() => {
    const fetchSalonInfo = async () => {
      try {
        const token = sessionStorage.getItem("token");
        console.log("Token:", token); // 👈 Check token
        const response = await axios.get(`${apiBaseUrl}/api/salon/info/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSalonInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch salon info:", error);
        setError("Could not load salon info.");
      }
    };

    fetchSalonInfo();
  }, [apiBaseUrl]);

  

    useEffect(() => {
    if(!salonInfo) return;
    const salon_slug = salonInfo.salon.slug;

    const fetchBookingInfo = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/api/salon/bookings/${salon_slug}/`);
        setBookingInfo(response.data.bookings);
        
      }
      catch (error) {
        console.error("Failed to fetch booking info:", error);
        setError("Could not load booking information.");
      }
      
    };
    fetchBookingInfo();
  },[salonInfo,apiBaseUrl]);

  useEffect(() => {
  if (!salonInfo || !salonInfo.salon) return;
  const salon_slug = salonInfo.salon.slug;

  const fetchBookingTodayInfo = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/apisalon/bookings/today/${salon_slug}/`);
      setBookingTodayInfo(response.data.booking_count);
      }
    catch (error) {
      console.error("Failed to fetch today's bookings:", error);
      setError("Could not load today's bookings.");
    }
  }

  fetchBookingTodayInfo();
 }, [salonInfo,apiBaseUrl]);
 
  

    if (error) {
    return <div className="dashboard-error">Error: {error}</div>;
  }

    if (!salonInfo) {
    return <div className="dashboard-info-loader">Loading salon information...</div>;
  }
  console.log("Salon Info:", salonInfo);

  const copyPublicLink = () => {
    if (salonInfo.salon.website) {
      navigator.clipboard.writeText(salonInfo.salon.website);
      alert("Public booking link copied!");
    }
  };  

 
  console.log("Booking Info:", bookingInfo);
  console.log("Today's Booking Info:", bookingTodayInfo);

  const stats = [
    { label: "Today's Bookings", value: bookingTodayInfo.booking_count || "No bookings for today", icon: <Calendar />, color: "salon-red" },
    { label: "This Week", value: "89", icon: <BarChart3 />, color: "salon-yellow" },
    { label: "Total Clients", value: "456", icon: <Users />, color: "green" },
    { label: "Revenue (Month)", value: "$8,420", icon: <BarChart3 />, color: "blue" }
  ];

  /*const recentBookings = [
    { id: 1, client: "Sarah Johnson", service: "Hair Cut & Color", time: "10:00 AM", status: "confirmed" },
    { id: 2, client: "Mike Chen", service: "Beard Trim", time: "11:30 AM", status: "pending" },
    { id: 3, client: "Emma Wilson", service: "Manicure", time: "2:00 PM", status: "confirmed" },
    { id: 4, client: "David Brown", service: "Full Service", time: "3:30 PM", status: "confirmed" }
  ];*/

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-icon">
            <Scissors />
          </div>
          <div>
            <h1>{salonInfo.salon.name} Dashboard</h1>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-new-booking">
            <Plus /> Add Service
          </button>
          <button className="btn-settings">
            <Settings />
          </button>
        </div>
      </header>

      <section className="public-link">
        <div className="link-info">
          <h2>Your Public Booking Page</h2>
          <p>Share this link with your clients for easy online booking</p>
          <div className="link-controls">
            <code>{salonInfo.salon.website}</code>
            <button onClick={copyPublicLink}><Copy /> Copy</button>
            <button><Eye /> Preview</button>
          </div>
        </div>
        <LinkIcon className="link-icon" />
      </section>

      <section className="stats">
        {stats.map((stat, idx) => (
          <div key={idx} className={`stat-card ${stat.color}`}>
            <div>
              <p>{stat.label}</p>
              <h3>{stat.value}</h3>
            </div>
            <div className="stat-icon">{stat.icon}</div>
          </div>
        ))}
      </section>

      <div className="main-grid">
        <div className="appointments">
          <div className="section-header">
            <h3>Recent Appointments</h3>
            <button>View All</button>
          </div>
         {bookingInfo.map((booking, index) => (
             <div key={index} className="booking-card">
            <div className="booking-info">
      <Users />
      <div>
        <p>{booking.client_name}</p>
        <span>{booking.service_type}</span>
      </div>
    </div>
    <div className="booking-meta">
      <p>Time: {booking.time_slot}</p>
      <p>Date: {booking.date}</p>
      <span className="status confirmed">Confirmed</span> {/* You can adjust status logic here */}
    </div>
  </div>
))}
        </div>

        <div className="sidebar">
          <div className="salon-info">
            <div className="section-header">
              <h3>Salon Information</h3>
              <Edit />
            </div>
            <p><strong>Name:</strong> {salonInfo.salon.name}</p>
            <p><strong>Address:</strong> {salonInfo.salon.address}</p>
            <p><strong>Phone:</strong> {salonInfo.salon.phone_number}</p>
            <p><strong>Email:</strong> {salonInfo.salon.email}</p>
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button><Calendar /> Manage Services</button>
            <button><Users /> Client Database</button>
            <button><Settings /> Customize Page</button>
            <button><BarChart3 /> Analytics</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
