import { useEffect, useState } from "react";

function ManagerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch("http://localhost:5000/api/manager/dashboard", {
      headers: {
        "x-user-id": user.id,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setDashboard(data.dashboard);
        } else {
          setError(data.message);
        }
      })
      .catch(() => {
        setError("Failed to load manager dashboard");
      });
  }, []);

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  if (!dashboard) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  const { hotel, stats, bookings } = dashboard;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>

        <p className="mt-1 text-gray-600">Manage {hotel.name}</p>

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

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900">
            Hotel Overview
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Hotel Name</p>
              <p className="font-medium">{hotel.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">
                {hotel.city}, {hotel.country}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Rating</p>
              <p className="font-medium">{hotel.rating ?? "No rating yet"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{hotel.address}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Bookings
          </h2>

          {bookings.length === 0 ? (
            <p className="mt-4 text-gray-500">No bookings yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-sm text-gray-500">
                    <th className="px-4 py-3">Guest</th>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Check-in</th>
                    <th className="px-4 py-3">Check-out</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b">
                      <td className="px-4 py-3">{booking.user.name}</td>

                      <td className="px-4 py-3">{booking.room.name}</td>

                      <td className="px-4 py-3">
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3">
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3">
                        ₹{booking.totalPrice.toLocaleString("en-IN")}
                      </td>

                      <td className="px-4 py-3">{booking.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
