import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Scissors, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import "./signup.css"; // External stylesheet

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
  toast.error("Password mismatch: Please ensure both passwords match.");
  return;
}

   if (!formData.agreeToTerms) {
  toast.error("Please accept the terms and conditions to continue.");
  return;
}

setIsLoading(true);
try {
  
  const response = await axios.post(`${apiBaseUrl}/api/api/register/user`, {
    full_name: formData.fullName,
    email: formData.email,
    phone_number: formData.phone,
    password: formData.password
  });

  if (response.status === 200) {
    toast.success("Account created successfully! Redirecting to login...");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  } 
} catch (error) {
  toast.error("Failed to create account. Please try again.");
} finally{
  setIsLoading(false);
}
 
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const benefits = [
    "Create your custom booking page",
    "Get your unique shareable link",
    "Manage appointments effortlessly",
    "Track business analytics",
    "24/7 customer support"
  ];

  return (
    <div className="signup-page">
      <div className="signup-overlay"></div>
      <div className="signup-container">
        <div className="signup-content">
          <div className="signup-left">
            <div className="icon-box">
              <Scissors className="icon" />
            </div>
            <h1>Start Your <span className="highlight">Salon Journey</span> Today</h1>
            <p>Join thousands of successful salon owners who have transformed their business with SalonHub.</p>

            <h3>What you'll get:</h3>
            <ul className="benefits-list">
              {benefits.map((benefit, index) => (
                <li key={index}><CheckCircle className="icon-check" /> {benefit}</li>
              ))}
            </ul>

            <div className="trial-box">
              <p className="trial-title">🚀 Free 30-Day Trial</p>
              <p className="trial-desc">No credit card required. Cancel anytime. Full access to all features.</p>
            </div>
          </div>

          <div className="signup-form-box">
            <h2>Create Your Account</h2>
            <p>Start managing your salon bookings in minutes</p>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>

              <div className="form-row">
                <div className="form-group password-group">
                  <label>Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <div className="form-group password-group">
                  <label>Confirm Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="toggle-password">
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange} />
                <label>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
              </div>

              <button type="submit" disabled={isLoading} className="submit-btn">
                {isLoading ? "Creating Account..." : "Create My Salon Account"}
              </button>
            </form>

            <p className="signin-text">
              Already have an account? <Link to="/login">Sign in here</Link>
            </p>

            <div className="back-home">
              <Link to="/"><ArrowLeft className="back-icon" /> Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
