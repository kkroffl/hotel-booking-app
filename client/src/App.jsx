import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ManagerLayout from "./layouts/ManagerLayout";

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
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerLogin from "./pages/manager/ManagerLogin";
import CreateHotel from "./pages/manager/CreateHotel";
import MyHotel from "./pages/manager/MyHotel";

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

          <Route element={<ManagerLayout />}>
            <Route path="/manager" element={<ManagerDashboard />} />

            <Route path="/manager/create-hotel" element={<CreateHotel />} />

            <Route path="/manager/hotel" element={<MyHotel />} />
          </Route>

          <Route path="/manager/login" element={<ManagerLogin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
