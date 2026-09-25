import SearchBar from "../components/SearchBar";
import HotelCard from "../components/HotelCard";
import FeatureCard from "../components/FeatureCard";
import hotels from "../data/hotels";

function Home() {
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
            We loop through our temporary hotel data.
            For every hotel, React creates one HotelCard.
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
