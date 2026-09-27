import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const room = location.state?.room;
  const hotel = location.state?.hotel;

  const user = JSON.parse(localStorage.getItem("user"));

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Login required</h2>

          <p className="mt-2 text-gray-600">
            Please login before booking a room.
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

  if (!room || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">
            Booking information missing
          </h2>

          <p className="mt-2 text-gray-600">
            Please select a room from the hotel details page.
          </p>

          <button
            type="button"
            onClick={() => navigate("/hotels")}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Browse Hotels
          </button>
        </div>
      </div>
    );
  }

  const calculateNights = () => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const difference = endDate - startDate;

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const totalPrice = nights > 0 ? nights * room.price : 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    if (nights <= 0) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    if (Number(guests) > room.capacity) {
      setError(`This room can accommodate up to ${room.capacity} guests.`);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          roomId: room.id,
          checkIn,
          checkOut,
          guests: Number(guests),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }

      navigate("/bookings");
    } catch (error) {
      console.error("Booking failed:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book your stay</h1>

          <p className="mt-2 text-gray-600">
            Complete the details below to reserve your room.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Booking form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Stay details
              </h2>

              {error && (
                <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="checkIn"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Check-in
                  </label>

                  <input
                    id="checkIn"
                    type="date"
                    value={checkIn}
                    onChange={(event) => setCheckIn(event.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkOut"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Check-out
                  </label>

                  <input
                    id="checkOut"
                    type="date"
                    value={checkOut}
                    onChange={(event) => setCheckOut(event.target.value)}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="guests"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Guests
                  </label>

                  <input
                    id="guests"
                    type="number"
                    min="1"
                    max={room.capacity}
                    value={guests}
                    onChange={(event) => setGuests(event.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-1 text-sm text-gray-500">
                    Maximum capacity: {room.capacity} guests
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Confirming Booking..." : "Confirm Booking"}
                </button>
              </form>
            </div>
          </div>

          {/* Booking summary */}
          <div>
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <img
                src={room.image}
                alt={room.name}
                className="h-48 w-full object-cover"
              />

              <div className="p-6">
                <p className="text-sm text-gray-500">{hotel.name}</p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {room.name}
                </h2>

                <div className="mt-5 space-y-3 border-t pt-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      ₹{room.price} × {nights || 0} nights
                    </span>

                    <span className="font-medium text-gray-900">
                      ₹{totalPrice}
                    </span>
                  </div>

                  <div className="flex justify-between border-t pt-3">
                    <span className="font-semibold text-gray-900">Total</span>

                    <span className="text-xl font-bold text-gray-900">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
