import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Bookings() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/bookings/user/${user.id}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch bookings");
        }

        setBookings(data.bookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "CANCELLED" }
            : booking,
        ),
      );
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      setError(error.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Login required</h2>

          <p className="mt-2 text-gray-600">
            Please login to view your bookings.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Unable to load bookings
            </h2>

            <p className="mt-2 text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>

          <p className="mt-2 text-gray-600">
            View your current and previous stays.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No bookings yet
            </h2>

            <p className="mt-2 text-gray-600">
              Your bookings will appear here after you make a reservation.
            </p>

            <button
              type="button"
              onClick={() => navigate("/hotels")}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Browse Hotels
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Booking #{booking.id}
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-gray-900">
                      {booking.room?.hotel?.name || "Hotel"}
                    </h2>

                    <p className="mt-1 text-gray-600">
                      {booking.room?.name || "Room"}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-md px-3 py-2 text-sm font-medium ${
                      booking.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </span>
                </div>

                <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-gray-500">Check-in</p>
                    <p className="mt-1 font-medium text-gray-900">
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Check-out</p>
                    <p className="mt-1 font-medium text-gray-900">
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Guests</p>
                    <p className="mt-1 font-medium text-gray-900">
                      {booking.guests}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="mt-1 font-bold text-gray-900">
                      ₹{booking.totalPrice}
                    </p>
                  </div>
                </div>
                {booking.status === "CONFIRMED" && (
                  <div className="mt-5 border-t pt-5">
                    <button
                      type="button"
                      onClick={() => handleCancelBooking(booking.id)}
                      className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;
