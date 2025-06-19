import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Calendar,
  Users,
  Settings,
  Link as LinkIcon,
  Copy,
  Scissors,
  Edit,
  LogOut
} from "lucide-react";
import "./Dashboard.css";
import axios from "axios";
import ManageServicesModal from "./ManageServicesModal"; // Import your modal component
import { useNavigate }from "react-router-dom";
import CalendarView  from "./CalendarView";
const Dashboard = () => {
  const [salonInfo, setSalonInfo] = useState(null);
  const [error, setError] = useState(null);
  const [bookingInfo, setBookingInfo] = useState([]);
  const [bookingTodayInfo, setBookingTodayInfo] = useState(null);

  // Services modal states
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  // Fetch salon info
  useEffect(() => {
    const fetchSalonInfo = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("No auth token found");
        const response = await axios.get(`${apiBaseUrl}/api/salon/info/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSalonInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch salon info:", error);
        setError("Could not load salon info.");
      }
    };

    fetchSalonInfo();
  }, [apiBaseUrl]);

  // Fetch booking info when salonInfo is available
  useEffect(() => {
    if (!salonInfo) return;
    const salon_slug = salonInfo.salon.slug;

    const fetchBookingInfo = async () => {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/api/salon/bookings/${salon_slug}/`
        );
        setBookingInfo(response.data.bookings);
      } catch (error) {
        console.error("Failed to fetch booking info:", error);
        setError("Could not load booking information.");
      }
    };

    fetchBookingInfo();
  }, [salonInfo, apiBaseUrl]);

  // Fetch today's booking count
  useEffect(() => {
    if (!salonInfo) return;
    const salon_slug = salonInfo.salon.slug;

    const fetchBookingTodayInfo = async () => {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/api/salon/bookings/${salon_slug}/`
        );
        setBookingTodayInfo(response.data.booking_count);
      } catch (error) {
        console.error("Failed to fetch today's bookings:", error);
        setError("Could not load today's bookings.");
      }
    };

    fetchBookingTodayInfo();
  }, [salonInfo, apiBaseUrl]);

  // Fetch services for Manage Services modal
  const fetchServices = async () => {
    if (!salonInfo) return;
    setServicesLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${apiBaseUrl}/api/get_services`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServices(response.data.services);
      console.log(response.data)
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setError("Could not load services.");
    }
    setServicesLoading(false);
  };

  // Save updated service (local update + TODO: backend integration)
const handleSaveService = async (updatedService) => {
  const token = sessionStorage.getItem("token");

  if (!updatedService.id) {
    console.error("Missing service ID. Cannot update.");
    return;
  }

  // Update local state
  setServices((prev) =>
    prev.map((s) => (s.id === updatedService.id ? updatedService : s))
  );

  try {
    await axios.patch(
      `${apiBaseUrl}/api/modify/services/${updatedService.id}`,
      updatedService,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Service updated successfully");
  } catch (error) {
    console.error("Failed to update service:", error);
  }
};


  // Toggle service active status (local update + TODO: backend integration)
  const handleToggleActive = (service) => {
    const updatedService = { ...service, is_active: !service.is_active };
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? updatedService : s))
    );
    handleSaveService(updatedService)
  };

  const handleLogout = () =>{
    sessionStorage.removeItem("token")
    navigate("/")
  }

  const copyPublicLink = () => {
   const salon_slug = salonInfo.salon.slug;
  
   if(salon_slug){
    const publicLink = `${window.location.origin}/#/book/${salon_slug}`;
    navigator.clipboard.writeText(publicLink);
    alert("Public booking link copied!");
   }
  };

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>;
  }

  if (!salonInfo) {
    return <div className="dashboard-info-loader">Loading salon information...</div>;
  }

  const stats = [
    {
      label: "Today's Bookings",
      value: bookingTodayInfo ?? "No bookings for today",
      icon: <Calendar />,
      color: "salon-red",
    },
    { label: "This Week", value: "89", icon: <BarChart3 />, color: "salon-yellow" },
    { label: "Total Clients", value: "456", icon: <Users />, color: "green" },
    { label: "Revenue (Month)", value: "$8,420", icon: <BarChart3 />, color: "blue" },
  ];

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
          <button className="btn-new-booking" onClick={handleLogout}>
            <LogOut /> LogOut
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
            <button onClick={copyPublicLink}>
              <Copy /> Copy
            </button>
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
           {/* <div className="section-header">
            <h3>Appointments Calendar</h3>
              <button>View All</button>
            </div> */}
             <CalendarView bookings={bookingInfo} />
        </div>

        <div className="sidebar">
          <div className="salon-info">
            <div className="section-header">
              <h3>Salon Information</h3>
              <Edit />
            </div>
            <p>
              <strong>Salon Name:</strong> {salonInfo.salon.name}
            </p>
            <p>
              <strong>Address:</strong> {salonInfo.salon.address}
            </p>
            <p>
              <strong>Phone:</strong> {salonInfo.salon.phone_number}
            </p>
            <p>
              <strong>Email:</strong> {salonInfo.salon.email}
            </p>
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button
              onClick={() => {
                setShowServicesModal(true);
                fetchServices();
              }}
            >
              <Calendar /> Manage Services
            </button>
            <button>
              <Users /> Client Database
            </button>
            <button>
              <Settings /> Customize Page
            </button>
            <button>
              <BarChart3 /> Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Render Manage Services Modal */}
      {showServicesModal && (
        <ManageServicesModal
          services={services}
          servicesLoading={servicesLoading}
          onClose={() => setShowServicesModal(false)}
          onSaveService={handleSaveService}
          onToggleActive={handleToggleActive}
        />
      )}
    </div>
  );
};

export default Dashboard;
