import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import HotelCard from "../components/HotelCard";

function Hotels() {
  // Read the search information from the URL.
  const [searchParams] = useSearchParams();

  const location = searchParams.get("location");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");

  // Store hotels received from the backend API.
  const [hotels, setHotels] = useState([]);

  // Store loading and error states.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // These states store the filters selected by the user.
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Fetch hotels from our Express backend.
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/api/hotels");

        if (!response.ok) {
          throw new Error("Failed to fetch hotels");
        }

        const data = await response.json();

        setHotels(data.hotels || []);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
        setError("Unable to load hotels. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // First filter the hotels by location.
  let filteredHotels = location
    ? hotels.filter((hotel) =>
        hotel.location.toLowerCase().includes(location.toLowerCase()),
      )
    : hotels;

  // Filter hotels based on the maximum starting price selected by the user.
  if (maxPrice) {
    filteredHotels = filteredHotels.filter(
      (hotel) => hotel.startingPrice <= Number(maxPrice),
    );
  }

  // Filter hotels based on the minimum rating.
  if (minRating) {
    filteredHotels = filteredHotels.filter(
      (hotel) => hotel.rating >= Number(minRating),
    );
  }

  // Create a copy before sorting so we don't directly modify our original data.
  if (sortBy === "price-low") {
    filteredHotels = [...filteredHotels].sort(
      (a, b) => a.startingPrice - b.startingPrice,
    );
  }

  if (sortBy === "price-high") {
    filteredHotels = [...filteredHotels].sort(
      (a, b) => b.startingPrice - a.startingPrice,
    );
  }

  if (sortBy === "rating") {
    filteredHotels = [...filteredHotels].sort((a, b) => b.rating - a.rating);
  }

  // Reset all filters back to their initial values.
  const clearFilters = () => {
    setMaxPrice("");
    setMinRating("");
    setSortBy("");
  };

  // Show loading state while fetching hotels.
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-gray-600">Loading hotels...</p>
        </div>
      </div>
    );
  }

  // Show error state if the API request fails.
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Unable to load hotels
            </h2>

            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hotels</h1>

          <p className="mt-2 text-gray-600">
            {location
              ? `Showing hotels near ${location}`
              : "Explore our available hotels"}
          </p>
        </div>

        {/* Search summary */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">Your search</h2>

          <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium text-gray-900">
                {location || "Any location"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Check-in</p>
              <p className="font-medium text-gray-900">
                {checkIn || "Not selected"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Check-out</p>
              <p className="font-medium text-gray-900">
                {checkOut || "Not selected"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Guests</p>
              <p className="font-medium text-gray-900">{guests || "1"}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
            {/* Maximum price */}
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Maximum price per night
              </label>

              <input
                type="number"
                min="0"
                placeholder="Example: 5000"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Minimum rating */}
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Minimum rating
              </label>

              <select
                value={minRating}
                onChange={(event) => setMinRating(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">Any rating</option>
                <option value="4">4.0+</option>
                <option value="4.5">4.5+</option>
                <option value="4.8">4.8+</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sort by
              </label>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
              </select>
            </div>

            {/* Clear filters */}
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results */}
        {filteredHotels.length > 0 ? (
          <div>
            <div className="mb-5">
              <p className="text-gray-600">
                {filteredHotels.length}{" "}
                {filteredHotels.length === 1 ? "hotel" : "hotels"} found
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No hotels found
            </h2>

            <p className="mt-2 text-gray-600">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Hotels;
