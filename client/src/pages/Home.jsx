import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import HotelCard from "../components/HotelCard";
import FeatureCard from "../components/FeatureCard";

function Home() {
  // Stores hotel data received from our backend API
  const [hotels, setHotels] = useState([]);

  // Shows a loading message while the API request is running
  const [loading, setLoading] = useState(true);

  // Stores an error message if the API request fails
  const [error, setError] = useState("");

  // Fetch hotel data from our Express backend
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/hotels");

        if (!response.ok) {
          throw new Error("Failed to fetch hotels");
        }

        const data = await response.json();

        // Store the hotels returned by PostgreSQL
        setHotels(data.hotels);
      } catch (error) {
        console.error("Failed to load hotels:", error);
        setError("Unable to load hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Show this while waiting for the backend response
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Loading hotels...</p>
      </div>
    );
  }

  // Show this if the API request fails
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Find your perfect stay
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100 md:text-xl">
            Discover comfortable hotels, compare rooms, and book your next stay
            with ease.
          </p>

          <SearchBar />
        </div>
      </section>

      {/* Featured hotels section */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          {/* Section heading */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Hotels
            </h2>

            <p className="mt-2 text-gray-600">
              Explore some of our popular stays.
            </p>
          </div>

          {/* 
            We now loop through hotel data received
            from PostgreSQL through our backend API.
          */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* Why StayNest section */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          {/* Section heading */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why StayNest?</h2>

            <p className="mx-auto mt-2 max-w-2xl text-gray-600">
              Everything you need to find and book your next stay with
              confidence.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon="💰"
              title="Great prices"
              description="Find comfortable stays at competitive prices without the hassle."
            />

            <FeatureCard
              icon="🔒"
              title="Secure booking"
              description="Your booking information is handled securely throughout the reservation process."
            />

            <FeatureCard
              icon="⭐"
              title="Trusted stays"
              description="Explore highly rated hotels and make your next trip more comfortable."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
