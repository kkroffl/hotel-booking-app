// Temporary hotel data.
// Later, this information will come from our PostgreSQL database through the backend API.

const hotels = [
  {
    id: 1,
    name: "The Grand Chennai",
    location: "Chennai, Tamil Nadu",
    rating: 4.7,
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Ocean View Resort",
    location: "Goa, India",
    rating: 4.8,
    price: 6200,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Mountain Retreat",
    location: "Manali, Himachal Pradesh",
    rating: 4.6,
    price: 3800,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Royal Palace Hotel",
    location: "Jaipur, Rajasthan",
    rating: 4.9,
    price: 5500,
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80",
  },
];

export default hotels;
