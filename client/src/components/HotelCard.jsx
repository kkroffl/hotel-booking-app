import { Link } from "react-router-dom";

function HotelCard({ hotel }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Hotel image */}
      <img
        src={hotel.image}
        alt={hotel.name}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        {/* Hotel name */}
        <h3 className="text-xl font-semibold text-gray-900">{hotel.name}</h3>

        {/* Hotel location */}
        <p className="mt-1 text-sm text-gray-500">{hotel.location}</p>

        {/* Rating and starting price */}
        <div className="mt-4 flex items-center justify-between">
          <span className="rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-700">
            ★ {hotel.rating}
          </span>

          <p className="text-lg font-bold text-gray-900">
            ₹{hotel.startingPrice}
            <span className="text-sm font-normal text-gray-500">/night</span>
          </p>
        </div>

        {/* Link to the hotel's details page */}
        <Link
          to={`/hotels/${hotel.id}`}
          className="mt-5 block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white transition hover:bg-blue-700"
        >
          View Hotel
        </Link>
      </div>
    </div>
  );
}

export default HotelCard;
