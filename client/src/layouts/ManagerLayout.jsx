import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function ManagerLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/manager/login");
  };

  const navigation = [
    {
      name: "Dashboard",
      path: "/manager",
    },
    {
      name: "My Hotel",
      path: "/manager/hotel",
    },
    {
      name: "Rooms",
      path: "/manager/rooms",
    },
    {
      name: "Bookings",
      path: "/manager/bookings",
    },
    {
      name: "Reviews",
      path: "/manager/reviews",
    },
    {
      name: "Analytics",
      path: "/manager/analytics",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="border-b border-gray-200 px-6 py-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            StayNest
          </h1>

          <p className="mt-1 text-sm text-gray-500">Manager Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">
          <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Management
          </p>

          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/manager"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Manager account */}
        <div className="border-t border-gray-200 p-4">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user?.name || "Hotel Manager"}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {user?.email || "Hotel Manager"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm lg:hidden"
      >
        Menu
      </button>

      {/* Main content */}
      <main className="min-h-screen lg:ml-64">
        <div className="p-6 pt-16 sm:p-8 sm:pt-16 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ManagerLayout;
