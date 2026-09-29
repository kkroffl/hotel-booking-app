import { NavLink, Outlet, useNavigate } from "react-router-dom";

function ManagerLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/manager/login");
  };

  const linkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-3 text-sm font-medium ${
      isActive ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-white p-5">
          <h1 className="px-4 text-2xl font-bold">StayNest</h1>

          <p className="px-4 pt-1 text-sm text-gray-500">Manager Portal</p>

          <nav className="mt-8 space-y-2">
            <NavLink to="/manager" end className={linkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/manager/hotel" className={linkClass}>
              My Hotel
            </NavLink>

            <NavLink to="/manager/rooms" className={linkClass}>
              Rooms
            </NavLink>

            <NavLink to="/manager/bookings" className={linkClass}>
              Bookings
            </NavLink>

            <NavLink to="/manager/reviews" className={linkClass}>
              Reviews
            </NavLink>

            <NavLink to="/manager/analytics" className={linkClass}>
              Analytics
            </NavLink>
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </aside>

        <main className="flex-1">
          <div className="border-b bg-white px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Manager Portal
                </h2>
                <p className="text-sm text-gray-500">
                  Manage your hotel and bookings
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {JSON.parse(localStorage.getItem("user"))?.name}
                  </p>
                  <p className="text-xs text-gray-500">Hotel Manager</p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700">
                  {JSON.parse(localStorage.getItem("user"))?.name?.charAt(0)}
                </div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <Outlet />
          </div>{" "}
        </main>
      </div>
    </div>
  );
}

export default ManagerLayout;
