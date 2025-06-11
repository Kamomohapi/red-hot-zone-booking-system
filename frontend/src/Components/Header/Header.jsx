
import { Link } from "react-router-dom";
import { Scissors, Calendar, Users, LogIn, UserPlus } from "lucide-react";
import "./Header.css";


const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <div className="logo-icon">
              <Scissors className="icon-white" />
            </div>
            <div>
              <h1 className="logo-title">Bookings Hub</h1>
              <p className="logo-subtitle">Booking Made Simple</p>
            </div>
          </Link>

          <nav className="nav-links">
            <a href="#features" className="nav-item">
                <Calendar className="icon-small" />
                <span>Features</span>
            </a>
            <Link to="/" className="nav-item">
              <Users className="icon-small" />
              <span>For Salons</span>
            </Link>
          </nav>

          <div className="auth-buttons">
            <Link to="/login" className="btn-login">
              <LogIn className="icon-xs" />
              <span>Login</span>
            </Link>
            <Link to="/signup" className="btn-signup">
              <UserPlus className="icon-xs" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
