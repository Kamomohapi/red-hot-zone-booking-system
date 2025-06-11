import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const RequireSalon = ({ children }) => {
  const [hasSalon, setHasSalon] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setHasSalon(false);
      return;
    }

    axios.get("http://127.0.0.1:8000/api/salon/website/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        // Adjust this line based on your actual API response structure
        const website = res.data?.website || res.data;
        setHasSalon(typeof website === "string" && website.startsWith("http"));
        console.log(res.data);
      })
      .catch(() => setHasSalon(false));
  }, []);

  
  if (hasSalon === null) return <p>Loading...</p>;

  return hasSalon ? children : <Navigate to="/setup-salon" />;
};

export default RequireSalon;
