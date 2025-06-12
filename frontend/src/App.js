import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Homepage from './Pages/Homepage/Homepage';
import Signup from './Pages/Signup/Signup';
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import SalonSetup from './Pages/SetupSalon/SalonSetup';
import RequireSalon from './Pages/RequireSalon/RequireSalon';
import BrandingEditor from './Pages/Branding/BrandingForm';
import BookingPage from './Pages/Booking/BookingPage';

function App() {
  return (
    <div className="App">
      <HashRouter>
       <ToastContainer />
        <Routes>
          <Route path="/" element={ <Homepage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/dashboard" element={<RequireSalon><Dashboard/></RequireSalon>} />
          <Route path="/setup-salon" element={<SalonSetup/>} />
          <Route path="/dashboard/branding" element={<BrandingEditor/>} />
          <Route path="/book/:slug" element={<BookingPage />} />
          {/* Add more routes as needed */}
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
