import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function HotelDetails() {
  // Get the hotel ID from the URL.
  const { id } = useParams();

  // Store the hotel received from the backend.
  const [hotel, setHotel] = useState(null);

  // Store loading and error states.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the selected hotel from our backend.
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`http://localhost:5000/api/hotels/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch hotel");
        }

        const data = await response.json();

        setHotel(data.hotel);
      } catch (error) {
        console.error("Failed to fetch hotel:", error);
        setError("Unable to load hotel details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  // Loading state.
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  // Error state.
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Unable to load hotel
            </h2>

            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Hotel was not found.
  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Hotel not found
            </h2>

            <p className="mt-2 text-gray-600">
              The hotel you are looking for does not exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Hotel image */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="h-72 w-full object-cover md:h-96"
          />
        </div>

        {/* Hotel information */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                {hotel.name}
              </h1>

              <p className="mt-2 text-gray-500">
                {hotel.city}, {hotel.country}
              </p>
            </div>

            {/* Rating */}
            {hotel.rating !== null && (
              <span className="w-fit rounded-md bg-green-100 px-3 py-2 font-medium text-green-700">
                ★ {hotel.rating}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900">
              About this hotel
            </h2>

            <p className="mt-2 leading-7 text-gray-600">{hotel.description}</p>
          </div>

          {/* Address */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900">Location</h2>

            <p className="mt-2 text-gray-600">
              {hotel.address}, {hotel.city}, {hotel.country}
            </p>
          </div>
        </div>

        {/* Rooms */}
        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Rooms
            </h2>

            <p className="mt-1 text-gray-600">
              Choose a room that suits your stay.
            </p>
          </div>

          {hotel.rooms.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {hotel.rooms.map((room) => (
                <div
                  key={room.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Room image */}
                  <img
                    src={room.image}
                    alt={room.name}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {room.name}
                      </h3>

                      <p className="whitespace-nowrap text-lg font-bold text-gray-900">
                        ₹{room.price}
                        <span className="text-sm font-normal text-gray-500">
                          /night
                        </span>
                      </p>
                    </div>

                    <p className="mt-3 text-gray-600">{room.description}</p>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="rounded-md bg-gray-100 px-3 py-2">
                        👤 Up to {room.capacity} guests
                      </span>

                      <span className="rounded-md bg-gray-100 px-3 py-2">
                        🏨 {room.totalRooms} rooms available
                      </span>
                    </div>

                    <button
                      type="button"
                      className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">
                No rooms are currently available at this hotel.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default HotelDetails;
