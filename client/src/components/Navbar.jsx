import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/user.png";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const handleAuthChange = () => {
      const storedUser = localStorage.getItem("user");

      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("authChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          StayNest
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-700 transition hover:text-blue-600">
            Home
          </Link>

          <Link
            to="/hotels"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Hotels
          </Link>

          {user ? (
            <>
              <Link
                to="/bookings"
                className="text-gray-700 transition hover:text-blue-600"
              >
                My Bookings
              </Link>

              <span className="font-medium text-gray-700">
                Welcome, {user.name}
              </span>

              <Link
                to="/profile"
                className="flex items-center text-gray-700 transition hover:text-blue-600"
              >
                <img
                  src={logo}
                  alt="Profile Icon"
                  className="h-8 w-8 object-contain"
                />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 transition hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
