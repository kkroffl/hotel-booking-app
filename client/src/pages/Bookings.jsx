import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Bookings() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [bookings, setBookings] = useState([]);
  const [reviewedHotels, setReviewedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/bookings/user/${user.id}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch bookings");
        }

        const fetchedBookings = data.bookings || [];

        setBookings(fetchedBookings);

        // Check which completed hotels have already been reviewed
        const completedBookings = fetchedBookings.filter(
          (booking) => booking.status === "COMPLETED",
        );

        const reviewChecks = await Promise.all(
          completedBookings.map(async (booking) => {
            const hotelId = booking.room?.hotel?.id;

            if (!hotelId) {
              return null;
            }

            try {
              const reviewResponse = await fetch(
                `http://localhost:5000/api/reviews/hotel/${hotelId}`,
              );

              const reviewData = await reviewResponse.json();

              if (!reviewResponse.ok) {
                return null;
              }

              const alreadyReviewed = reviewData.reviews?.some(
                (review) => review.user?.id === user.id,
              );

              return alreadyReviewed ? hotelId : null;
            } catch {
              return null;
            }
          }),
        );

        setReviewedHotels(reviewChecks.filter((hotelId) => hotelId !== null));
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "CANCELLED" }
            : booking,
        ),
      );
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      setError(error.message);
    }
  };

  const openReviewModal = (booking) => {
    setReviewBooking(booking);
    setRating(0);
    setComment("");
    setReviewError("");
  };

  const closeReviewModal = () => {
    if (reviewLoading) {
      return;
    }

    setReviewBooking(null);
    setRating(0);
    setComment("");
    setReviewError("");
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    setReviewError("");

    if (rating === 0) {
      setReviewError("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      setReviewError("Please write a review.");
      return;
    }

    try {
      setReviewLoading(true);

      const hotelId = reviewBooking.room?.hotel?.id;

      if (!hotelId) {
        throw new Error("Hotel information is missing.");
      }

      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          hotelId,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      setReviewedHotels((current) => [...current, hotelId]);

      closeReviewModal();
    } catch (error) {
      console.error("Failed to submit review:", error);
      setReviewError(error.message);
    } finally {
      setReviewLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Login required</h2>

          <p className="mt-2 text-gray-600">
            Please login to view your bookings.
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Unable to load bookings
            </h2>

            <p className="mt-2 text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>

            <p className="mt-2 text-gray-600">
              View your current and previous stays.
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                No bookings yet
              </h2>

              <p className="mt-2 text-gray-600">
                Your bookings will appear here after you make a reservation.
              </p>

              <button
                type="button"
                onClick={() => navigate("/hotels")}
                className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
              >
                Browse Hotels
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const hotelId = booking.room?.hotel?.id;

                const hasReviewed = hotelId && reviewedHotels.includes(hotelId);

                return (
                  <div
                    key={booking.id}
                    className="rounded-2xl bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Booking #{booking.id}
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900">
                          {booking.room?.hotel?.name || "Hotel"}
                        </h2>

                        <p className="mt-1 text-gray-600">
                          {booking.room?.name || "Room"}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-md px-3 py-2 text-sm font-medium ${
                          booking.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-sm text-gray-500">Check-in</p>

                        <p className="mt-1 font-medium text-gray-900">
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Check-out</p>

                        <p className="mt-1 font-medium text-gray-900">
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Guests</p>

                        <p className="mt-1 font-medium text-gray-900">
                          {booking.guests}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Total</p>

                        <p className="mt-1 font-bold text-gray-900">
                          ₹{booking.totalPrice}
                        </p>
                      </div>
                    </div>

                    {(booking.status === "CONFIRMED" ||
                      booking.status === "COMPLETED") && (
                      <div className="mt-5 flex flex-wrap gap-3 border-t pt-5">
                        {booking.status === "CONFIRMED" && (
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700"
                          >
                            Cancel Booking
                          </button>
                        )}

                        {booking.status === "COMPLETED" &&
                          (hasReviewed ? (
                            <button
                              type="button"
                              disabled
                              className="rounded-lg border border-gray-300 bg-gray-100 px-5 py-2.5 font-medium text-gray-500"
                            >
                              Reviewed
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openReviewModal(booking)}
                              className="rounded-lg bg-black px-5 py-2.5 font-medium text-white transition hover:bg-gray-800"
                            >
                              Write Review
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Write a Review
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {reviewBooking.room?.hotel?.name}
                </p>
              </div>

              <button
                type="button"
                onClick={closeReviewModal}
                disabled={reviewLoading}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {reviewError && (
              <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="mt-6">
              <div>
                <p className="text-sm font-medium text-gray-700">Your Rating</p>

                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl transition ${
                        star <= rating ? "text-gray-900" : "text-gray-300"
                      } hover:text-gray-900`}
                      aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="reviewComment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Review
                </label>

                <textarea
                  id="reviewComment"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows="5"
                  placeholder="Share your experience..."
                  className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeReviewModal}
                  disabled={reviewLoading}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="rounded-lg bg-black px-5 py-2.5 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Bookings;
