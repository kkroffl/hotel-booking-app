import { useEffect, useMemo, useState } from "react";

function ManagerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchBookings = async () => {
      if (!user) {
        setError("Manager login required");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/manager/dashboard",
          {
            headers: {
              "x-user-id": user.id,
            },
          },
        );

        const data = await response.json();

        if (!response.ok || data.status !== "success") {
          throw new Error(data.message || "Failed to load bookings");
        }

        setBookings(data.dashboard.bookings || []);
      } catch (error) {
        setError(error.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        booking.user?.name?.toLowerCase().includes(searchValue) ||
        booking.user?.email?.toLowerCase().includes(searchValue) ||
        booking.room?.name?.toLowerCase().includes(searchValue) ||
        String(booking.id).includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "CONFIRMED",
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "COMPLETED",
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === "CANCELLED",
  ).length;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>

        <p className="mt-2 text-gray-500">Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>

        <p className="mt-1 text-gray-500">Manage bookings made at your hotel</p>
      </div>

      {/* Booking statistics */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Bookings</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {bookings.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Confirmed</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {confirmedCount}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {completedCount}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Cancelled</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {cancelledCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 rounded-xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search guest, email, room or booking ID..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black md:w-48"
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings table */}
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-900">All Bookings</h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredBookings.length} booking
            {filteredBookings.length !== 1 ? "s" : ""} shown
          </p>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-gray-900">No bookings found</p>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4 font-medium">Booking</th>

                  <th className="px-6 py-4 font-medium">Guest</th>

                  <th className="px-6 py-4 font-medium">Room</th>

                  <th className="px-6 py-4 font-medium">Check-in</th>

                  <th className="px-6 py-4 font-medium">Check-out</th>

                  <th className="px-6 py-4 font-medium">Guests</th>

                  <th className="px-6 py-4 font-medium">Amount</th>

                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        #{booking.id}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(booking.createdAt)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {booking.user?.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {booking.user?.email}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {booking.room?.name}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(booking.checkIn)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(booking.checkOut)}
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

export default ManagerBookings;
