import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  // These states store whatever the user enters into the search form.
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  // useNavigate lets us programmatically move the user to another page.
  const navigate = useNavigate();

  // This function runs when the user clicks "Search Hotels".
  const handleSearch = (event) => {
    event.preventDefault();

    // We don't want users searching without entering a location.
    if (!location.trim()) {
      alert("Please enter a location.");
      return;
    }

    // URLSearchParams safely creates the query parameters for our URL.
    const searchParams = new URLSearchParams({
      location,
      checkIn,
      checkOut,
      guests: String(guests),
    });

    // Move the user to the hotel listing page with their search information.
    navigate(`/hotels?${searchParams.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto mt-8 max-w-5xl rounded-2xl bg-white p-4 shadow-xl"
    >
      <div className="grid gap-4 md:grid-cols-4">
        {/* Location */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Location
          </label>

          <input
            type="text"
            placeholder="Where are you going?"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
          />
        </div>

        {/* Check-in */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Check-in
          </label>

          <input
            type="date"
            value={checkIn}
            onChange={(event) => setCheckIn(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
          />
        </div>

        {/* Check-out */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Check-out
          </label>

          <input
            type="date"
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
          />
        </div>

        {/* Guests */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Guests
          </label>

          <input
            type="number"
            min="1"
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Search button */}
      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Search Hotels
      </button>
    </form>
  );
}

export default SearchBar;
