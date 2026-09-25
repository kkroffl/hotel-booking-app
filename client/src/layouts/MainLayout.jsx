import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar appears at the top of every page */}
      <Navbar />

      {/* 
        Outlet is where React Router puts the page
        that matches the current URL.
      */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer appears at the bottom of every page */}
      <Footer />
    </div>
  );
}

export default MainLayout;
