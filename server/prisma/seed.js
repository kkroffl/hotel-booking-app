const prisma = require("../src/prisma");

const hotels = [
  {
    name: "StayNest Grand Chennai",
    description:
      "A modern luxury hotel with comfortable rooms and premium amenities.",
    address: "OMR Road",
    city: "Chennai",
    country: "India",
    latitude: 12.8406,
    longitude: 80.1534,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    rating: 4.5,
  },
  {
    name: "StayNest Marina",
    description:
      "A stylish hotel offering a relaxing stay near the heart of the city.",
    address: "Marina Beach Road",
    city: "Chennai",
    country: "India",
    latitude: 13.05,
    longitude: 80.2824,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
    rating: 4.3,
  },
  {
    name: "StayNest City Palace",
    description:
      "A comfortable city hotel designed for both business and leisure travelers.",
    address: "Anna Salai",
    city: "Chennai",
    country: "India",
    latitude: 13.0569,
    longitude: 80.2425,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    rating: 4.6,
  },
  {
    name: "StayNest Royal Mumbai",
    description:
      "A premium hotel offering elegant rooms and excellent city access.",
    address: "Marine Drive",
    city: "Mumbai",
    country: "India",
    latitude: 18.943,
    longitude: 72.8238,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    rating: 4.7,
  },
  {
    name: "StayNest Bengaluru Heights",
    description: "A modern business-friendly hotel in the heart of Bengaluru.",
    address: "MG Road",
    city: "Bengaluru",
    country: "India",
    latitude: 12.9758,
    longitude: 77.605,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    rating: 4.4,
  },
  {
    name: "StayNest Hyderabad Central",
    description:
      "A comfortable stay combining modern facilities with traditional hospitality.",
    address: "Banjara Hills",
    city: "Hyderabad",
    country: "India",
    latitude: 17.4126,
    longitude: 78.4482,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
    rating: 4.5,
  },
  {
    name: "StayNest Delhi Grand",
    description:
      "A spacious luxury hotel conveniently located near major attractions.",
    address: "Connaught Place",
    city: "New Delhi",
    country: "India",
    latitude: 28.6315,
    longitude: 77.2167,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
    rating: 4.6,
  },
  {
    name: "StayNest Jaipur Palace",
    description: "A heritage-inspired hotel offering a royal stay in Jaipur.",
    address: "C Scheme",
    city: "Jaipur",
    country: "India",
    latitude: 26.9124,
    longitude: 75.7873,
    image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897",
    rating: 4.8,
  },
  {
    name: "StayNest Kochi Waterfront",
    description:
      "A peaceful waterfront hotel perfect for leisure and family stays.",
    address: "Marine Drive",
    city: "Kochi",
    country: "India",
    latitude: 9.9816,
    longitude: 76.276,
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
    rating: 4.5,
  },
  {
    name: "StayNest Goa Resort",
    description:
      "A relaxing resort offering comfortable rooms close to Goa's beaches.",
    address: "Calangute Beach Road",
    city: "Goa",
    country: "India",
    latitude: 15.544,
    longitude: 73.755,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    rating: 4.7,
  },
  {
    name: "StayNest Singapore",
    description:
      "A contemporary hotel offering premium accommodation in central Singapore.",
    address: "Orchard Road",
    city: "Singapore",
    country: "Singapore",
    latitude: 1.3048,
    longitude: 103.8318,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    rating: 4.6,
  },
  {
    name: "StayNest Dubai Marina",
    description:
      "A luxurious waterfront hotel with modern rooms and spectacular views.",
    address: "Dubai Marina",
    city: "Dubai",
    country: "UAE",
    latitude: 25.0806,
    longitude: 55.1403,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    rating: 4.8,
  },
  {
    name: "StayNest London Central",
    description:
      "A stylish city hotel close to London's major landmarks and attractions.",
    address: "Westminster",
    city: "London",
    country: "UK",
    latitude: 51.4975,
    longitude: -0.1357,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
    rating: 4.5,
  },
  {
    name: "StayNest Paris",
    description:
      "An elegant hotel offering a comfortable stay in the heart of Paris.",
    address: "Rue de Rivoli",
    city: "Paris",
    country: "France",
    latitude: 48.8566,
    longitude: 2.3522,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
    rating: 4.7,
  },
  {
    name: "StayNest New York",
    description: "A modern hotel offering premium accommodation in Manhattan.",
    address: "Manhattan",
    city: "New York",
    country: "USA",
    latitude: 40.758,
    longitude: -73.9855,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
    rating: 4.6,
  },
  {
    name: "StayNest Tokyo",
    description:
      "A contemporary hotel combining Japanese hospitality with modern comfort.",
    address: "Shinjuku",
    city: "Tokyo",
    country: "Japan",
    latitude: 35.6938,
    longitude: 139.7034,
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
    rating: 4.7,
  },
  {
    name: "StayNest Bangkok",
    description:
      "A vibrant city hotel offering comfortable rooms and convenient transport access.",
    address: "Sukhumvit Road",
    city: "Bangkok",
    country: "Thailand",
    latitude: 13.7367,
    longitude: 100.561,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    rating: 4.4,
  },
  {
    name: "StayNest Bali Resort",
    description:
      "A tropical resort offering peaceful accommodation surrounded by nature.",
    address: "Seminyak",
    city: "Bali",
    country: "Indonesia",
    latitude: -8.6913,
    longitude: 115.168,
    image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897",
    rating: 4.8,
  },
  {
    name: "StayNest Sydney Harbour",
    description:
      "A premium waterfront hotel with modern rooms and stunning harbour views.",
    address: "Circular Quay",
    city: "Sydney",
    country: "Australia",
    latitude: -33.8568,
    longitude: 151.2153,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    rating: 4.7,
  },
  {
    name: "StayNest Toronto",
    description:
      "A modern urban hotel offering comfortable accommodation in downtown Toronto.",
    address: "Downtown Toronto",
    city: "Toronto",
    country: "Canada",
    latitude: 43.6532,
    longitude: -79.3832,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    rating: 4.5,
  },
];

async function main() {
  await prisma.hotel.createMany({
    data: hotels,
  });

  console.log(`${hotels.length} hotels added successfully`);
}

main()
  .catch((error) => {
    console.error("Failed to seed hotels:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
