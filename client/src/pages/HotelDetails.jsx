import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function HotelDetails() {
  // Get the hotel ID from the URL.
  const { id } = useParams();

  const navigate = useNavigate();

  // Store the hotel received from the backend.
  const [hotel, setHotel] = useState(null);

  // Store loading and error states.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Store review states.
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);

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

    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/reviews/hotel/${id}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch reviews");
        }

        setReviews(data.reviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchReviews();

    const checkReviewEligibility = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return;
      }

      const user = JSON.parse(storedUser);

      try {
        const response = await fetch(
          `http://localhost:5000/api/bookings/user/${user.id}`,
        );

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        const completedBooking = data.bookings?.some(
          (booking) =>
            booking.status === "CONFIRMED" &&
            booking.room?.hotelId === Number(id) &&
            new Date(booking.checkOut) < new Date(),
        );

        setCanReview(Boolean(completedBooking));
      } catch (error) {
        console.error("Failed to check review eligibility:", error);
      }
    };

    checkReviewEligibility();
  }, [id]);

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      setReviewError("Please login to write a review.");
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError("Please enter a comment.");
      return;
    }

    try {
      setReviewLoading(true);
      setReviewError("");
      setReviewSuccess("");

      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          hotelId: hotel.id,
          rating: Number(reviewRating),
          comment: reviewComment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      setReviews((currentReviews) => [data.review, ...currentReviews]);
      setReviewComment("");
      setReviewRating(5);
      setReviewSuccess("Review submitted successfully.");
    } catch (error) {
      console.error("Failed to submit review:", error);
      setReviewError(error.message);
    } finally {
      setReviewLoading(false);
    }
  };

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
                      onClick={() =>
                        navigate("/booking", {
                          state: {
                            room,
                            hotel,
                          },
                        })
                      }
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
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>

        {reviews.length === 0 ? (
          <p className="mt-4 text-gray-600">
            No reviews yet. Be the first to review this hotel.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">
                    {review.user?.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <p className="mt-2 text-yellow-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </p>

                <p className="mt-3 text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {canReview && (
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">
              Write a Review
            </h3>

            <form onSubmit={handleSubmitReview} className="mt-5 space-y-5">
              <div>
                <label
                  htmlFor="reviewRating"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Rating
                </label>

                <select
                  id="reviewRating"
                  value={reviewRating}
                  onChange={(event) => setReviewRating(event.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-3"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="reviewComment"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Comment
                </label>

                <textarea
                  id="reviewComment"
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  rows="4"
                  placeholder="Share your experience..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {reviewError && (
                <p className="text-sm text-red-600">{reviewError}</p>
              )}

              {reviewSuccess && (
                <p className="text-sm text-green-600">{reviewSuccess}</p>
              )}

              <button
                type="submit"
                disabled={reviewLoading}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default HotelDetails;
