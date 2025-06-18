import { useState } from "react";
import "./ManageService.css";
import axios from "axios";

const ManageServicesModal = ({
  services,
  servicesLoading,
  onClose,
  onSaveService,
  onToggleActive,
  // refreshServices, // Uncomment if you want to refresh after add
}) => {
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({ name: "", price: "", duration: "" });
  const [adding, setAdding] = useState(false);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.name || !newService.price || !newService.duration) return;
    setAdding(true);
    const token = sessionStorage.getItem("token");
    try {
      await axios.post(
        `${apiBaseUrl}/api/create_service`,
        {
              name: newService.name,
              duration: newService.duration,
              price: newService.price,
              is_active:true
            },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewService({ name: "", price: "", duration: "" });
      // if (refreshServices) refreshServices(); // Uncomment if you want to refresh after add
    } catch (error) {
      console.error("Failed to add service: ", error.response?.data || error.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal">
        <h2>Manage Services</h2>

        {/* Add Service Form */}
        <form className="add-service-form" onSubmit={handleAddService}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Service Name"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={newService.duration}
              onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Price (R)"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-activate" disabled={adding}>
            {adding ? "Adding..." : "Add Service"}
          </button>
        </form>

        {servicesLoading ? (
          <div className="loading-indicator">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="no-services-message">
            No services added yet. Please add a service.
          </div>
        ) : (
          <ul className="services-list">
            {services.map((service) => (
              <li key={service.id}>
                {editingService && editingService.id === service.id ? (
                  <div className="edit-form">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        onSaveService(editingService);
                        setEditingService(null);
                      }}
                    >
                      <div className="form-group">
                        <label>Service Name</label>
                        <input
                          value={editingService.name}
                          onChange={(e) =>
                            setEditingService({ ...editingService, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Price (R)</label>
                        <input
                          type="number"
                          value={editingService.price}
                          onChange={(e) =>
                            setEditingService({ ...editingService, price: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="form-actions">
                        <button type="button" className="btn btn-close" onClick={() => setEditingService(null)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-activate">
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="service-item">
                    <div className="service-details">
                      <span className="service-name">{service.name}</span>
                      <span className="service-price">R{service.price}</span>
                      <span className={`service-status ${service.is_active ? 'status-active' : 'status-inactive'}`}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="service-actions">
                      <button
                        className="btn btn-edit"
                        onClick={() => setEditingService(service)}
                      >
                        Edit
                      </button>
                      <button
                        className={`btn ${service.is_active ? 'btn-deactivate' : 'btn-activate'}`}
                        onClick={() => onToggleActive(service)}
                      >
                        {service.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <button className="btn btn-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ManageServicesModal;