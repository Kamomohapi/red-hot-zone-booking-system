
import React, { useState } from "react";
import "./ManageService.css"; // If you created a separate CSS file

const ManageServicesModal = ({
  services,
  servicesLoading,
  onClose,
  onSaveService,
  onToggleActive,
}) => {
  const [editingService, setEditingService] = useState(null);

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal">
        <h2>Manage Services</h2>
        
        {servicesLoading ? (
          <div className="loading-indicator">
            Loading services...
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
                      <span className={`service-status ${service.active ? 'status-active' : 'status-inactive'}`}>
                        {service.active ? 'Active' : 'Inactive'}
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
                        className={`btn ${service.active ? 'btn-deactivate' : 'btn-activate'}`}
                        onClick={() => onToggleActive(service)}
                      >
                        {service.active ? 'Deactivate' : 'Activate'}
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
