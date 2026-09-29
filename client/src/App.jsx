import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 
          All routes inside MainLayout automatically
          receive the same Navbar and Footer.
        */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/hotels" element={<Hotels />} />

          <Route path="/hotels/:id" element={<HotelDetails />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/booking" element={<Booking />} />

          <Route path="/bookings" element={<Bookings />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
