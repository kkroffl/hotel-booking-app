import { useEffect, useState } from "react";

function ManagerAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
          setError("Manager login required");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/manager/analytics",
          {
            headers: {
              "x-user-id": user.id,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load analytics");
        }

        setAnalytics(data.analytics);
      } catch (error) {
        console.error("Failed to load analytics:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-600">Loading analytics...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  if (!analytics) {
    return null;
  }

  const {
    hotel,
    overview,
    bookingStatus,
    monthlyData,
    roomPerformance,
    reviews,
  } = analytics;

  const maxRevenue = Math.max(...monthlyData.map((item) => item.revenue), 1);

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

          <p className="mt-1 text-gray-600">
            Performance overview for {hotel.name}
          </p>
        </div>

        {/* Overview */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Revenue</p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              ₹{overview.totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Bookings</p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {overview.totalBookings}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Guests</p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {overview.totalGuests}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Avg. Booking Value</p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              ₹
              {Math.round(overview.averageBookingValue).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">30-Day Occupancy</p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {overview.occupancyRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Revenue chart */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Revenue & Bookings
            </h2>

            <p className="mt-1 text-sm text-gray-500">Last 6 months</p>
          </div>

          <div className="mt-8 space-y-5">
            {monthlyData.map((item) => (
              <div key={`${item.month}-${item.year}`}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    {item.month} {item.year}
                  </span>

                  <span className="text-gray-500">
                    {item.bookings} bookings · ₹
                    {item.revenue.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-black"
                    style={{
                      width: `${(item.revenue / maxRevenue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking status */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Booking Status
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confirmed</span>

                  <span className="font-semibold">
                    {bookingStatus.confirmed}
                  </span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width: `${
                        overview.totalBookings > 0
                          ? (bookingStatus.confirmed / overview.totalBookings) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed</span>

                  <span className="font-semibold">
                    {bookingStatus.completed}
                  </span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${
                        overview.totalBookings > 0
                          ? (bookingStatus.completed / overview.totalBookings) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancelled</span>

                  <span className="font-semibold">
                    {bookingStatus.cancelled}
                  </span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{
                      width: `${
                        overview.totalBookings > 0
                          ? (bookingStatus.cancelled / overview.totalBookings) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Customer Reviews
            </h2>

            <div className="mt-8 flex items-center gap-8">
              <div>
                <p className="text-5xl font-bold text-gray-900">
                  {reviews.averageRating.toFixed(1)}
                </p>

                <p className="mt-2 text-gray-500">Average rating</p>
              </div>

              <div className="h-16 w-px bg-gray-200" />

              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {reviews.count}
                </p>

                <p className="mt-2 text-gray-500">Total reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Room performance */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Room Performance
          </h2>

          <div className="mt-6 overflow-x-auto">
            {roomPerformance.length === 0 ? (
              <p className="text-gray-500">No rooms available.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-sm text-gray-500">
                    <th className="px-4 py-3">Room</th>

                    <th className="px-4 py-3">Price / Night</th>

                    <th className="px-4 py-3">Bookings</th>

                    <th className="px-4 py-3">Revenue</th>
                  </tr>
                </thead>

                <tbody>
                  {roomPerformance.map((room) => (
                    <tr key={room.id} className="border-b last:border-0">
                      <td className="px-4 py-4 font-medium text-gray-900">
                        {room.name}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        ₹{room.price.toLocaleString("en-IN")}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {room.bookings}
                      </td>

                      <td className="px-4 py-4 font-semibold text-gray-900">
                        ₹{room.revenue.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerAnalytics;
