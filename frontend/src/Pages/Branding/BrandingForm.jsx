import React, { useState } from "react";
import "./BrandingEditor.css";
import axios from "axios";

const BrandingEditor = () => {
  const [coverImage, setCoverImage] = useState(null);
  const [themeColor, setThemeColor] = useState("#ff4757");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    const formData = new FormData();
    formData.append("cover_image", coverImage);
    formData.append("theme_color", themeColor);
    formData.append("welcome_message", welcomeMessage);

    try {
      await axios.post(`${apiBaseUrl}/api/salon/branding/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Branding updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update branding.");
    }
  };

  return (
    <div className="branding-editor">
      <h1>Edit Booking Page Branding</h1>
      <form onSubmit={handleSubmit}>
        <label>Cover Image:</label>
        <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} />
        
        <label>Theme Color:</label>
        <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} />

        <label>Welcome Message:</label>
        <input type="text" value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default BrandingEditor;
