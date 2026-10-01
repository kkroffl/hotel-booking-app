import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ManagerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch("http://localhost:5000/api/manager/hotel", {
      headers: {
        "x-user-id": user.id,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (response.status === 404) {
          navigate("/manager/create-hotel");
          return null;
        }

        if (!response.ok) {
          throw new Error(data.message || "Failed to load hotel");
        }

        return fetch("http://localhost:5000/api/manager/dashboard", {
          headers: {
            "x-user-id": user.id,
          },
        });
      })
      .then(async (response) => {
        if (!response) return;

        const data = await response.json();

        if (data.status === "success") {
          setDashboard(data.dashboard);
        } else {
          setError(data.message);
        }
      })
      .catch(() => {
        setError("Failed to load manager dashboard");
      });
  }, [navigate]);

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  if (!dashboard) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  const { hotel, stats, bookings } = dashboard;

  const recentBookings = bookings.slice(0, 5);

  const getStatusClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700";

      case "COMPLETED":
        return "bg-blue-100 text-blue-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>

        <p className="mt-1 text-gray-600">Manage {hotel.name}</p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Rooms</p>
          <p className="mt-2 text-3xl font-bold">{stats.rooms}</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Bookings</p>
          <p className="mt-2 text-3xl font-bold">{stats.bookings}</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Guests</p>
          <p className="mt-2 text-3xl font-bold">{stats.guests}</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Reviews</p>
          <p className="mt-2 text-3xl font-bold">{stats.reviews}</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="mt-2 text-3xl font-bold">
            ₹{stats.revenue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Hotel Overview */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-900">Hotel Overview</h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Hotel Name</p>
            <p className="mt-1 font-medium text-gray-900">{hotel.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="mt-1 font-medium text-gray-900">
              {hotel.city}, {hotel.country}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Rating</p>
            <p className="mt-1 font-medium text-gray-900">
              {hotel.rating ?? "No rating yet"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="mt-1 font-medium text-gray-900">{hotel.address}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="mt-8 rounded-xl bg-white shadow">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Bookings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest bookings for your hotel
            </p>
          </div>

          {bookings.length > 0 && (
            <button
              onClick={() => navigate("/manager/bookings")}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View All
            </button>
          )}
        </div>

        {recentBookings.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-gray-500">No bookings yet.</p>

            <p className="mt-1 text-sm text-gray-400">
              New hotel bookings will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4 font-medium">Booking</th>

                  <th className="px-6 py-4 font-medium">Guest</th>

                  <th className="px-6 py-4 font-medium">Room</th>

                  <th className="px-6 py-4 font-medium">Stay</th>

                  <th className="px-6 py-4 font-medium">Guests</th>

                  <th className="px-6 py-4 font-medium">Amount</th>

                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">#{booking.id}</p>

                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(booking.createdAt)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {booking.user.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {booking.user.email}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {booking.room.name}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {formatDate(booking.checkIn)}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        to {formatDate(booking.checkOut)}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {booking.guests}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      ₹{booking.totalPrice.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerDashboard;
