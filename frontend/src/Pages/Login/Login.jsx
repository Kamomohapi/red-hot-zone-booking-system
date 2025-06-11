// Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Scissors, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import "./Login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  //const { toast } = useToast();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    toast.error("Please fill in all fields.");
    return;
  }

  try {
    setIsLoading(true);
    const response = await axios.post(`${apiBaseUrl}/api/api/login/user`, {
      email: formData.email,
      password: formData.password,
    });

    if (response.status === 200) {
      const token = response.data.token; // Make sure your API returns a field named 'token'
      sessionStorage.setItem("token", token);

      toast.success("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  } catch (error) {
    toast.error("Login failed. Please check your credentials.");
  } finally {
    setIsLoading(false);
  }
};

console.log("API Base URL:", apiBaseUrl);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-page">
      <div className="overlay" />
      <div className="login-container">
        <div className="login-card">
          <div className="header-login">
            <div className="icon-box">
              <Scissors className="icon-white" />
            </div>
            <h1 className="title">Welcome Back</h1>
            <p className="subtitle">Sign in to your salon dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="form-utility">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? <><span className="spinner" /> Signing In...</> : "Sign In"}
            </button>
          </form>

          <div className="divider">OR</div>

          <button className="google-btn">Continue with Google</button>

          <div className="footer-text">
            <p>
              Don't have an account?{' '}
              <Link to="/signup">Sign up here</Link>
            </p>
          </div>

          <div className="back-home">
            <Link to="/">
              <ArrowLeft className="icon-back" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
