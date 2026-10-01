import { useEffect, useMemo, useState } from "react";

function ManagerReviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  });

  const [hotel, setHotel] = useState(null);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchReviews = async () => {
      if (!user) {
        setError("Manager login required");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/manager/reviews",
          {
            headers: {
              "x-user-id": user.id,
            },
          },
        );

        const data = await response.json();

        if (!response.ok || data.status !== "success") {
          throw new Error(data.message || "Failed to load reviews");
        }

        setReviews(data.reviews || []);
        setStats(data.stats);
        setHotel(data.hotel);
      } catch (error) {
        setError(error.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        review.user?.name?.toLowerCase().includes(searchValue) ||
        review.comment?.toLowerCase().includes(searchValue);

      const matchesRating =
        ratingFilter === "ALL" || review.rating === Number(ratingFilter);

      return matchesSearch && matchesRating;
    });
  }, [reviews, search, ratingFilter]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderStars = (rating) => {
    return (
      <span className="tracking-wide text-gray-900">
        {"★".repeat(rating)}
        <span className="text-gray-300">{"★".repeat(5 - rating)}</span>
      </span>
    );
  };

  const getPercentage = (count) => {
    if (stats.totalReviews === 0) {
      return 0;
    }

    return Math.round((count / stats.totalReviews) * 100);
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>

        <p className="mt-2 text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>

        <p className="mt-1 text-gray-500">
          Review customer feedback for {hotel?.name}
        </p>
      </div>

      {/* Summary */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Total reviews */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Reviews</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats.totalReviews}
          </p>
        </div>

        {/* Average rating */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Average Rating</p>

          <div className="mt-2 flex items-center gap-3">
            <p className="text-3xl font-bold text-gray-900">
              {stats.averageRating.toFixed(1)}
            </p>

            <div>
              <div className="text-sm">
                {renderStars(Math.round(stats.averageRating))}
              </div>

              <p className="mt-1 text-xs text-gray-500">out of 5</p>
            </div>
          </div>
        </div>

        {/* Rating distribution */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-900">
            Rating Distribution
          </p>

          <div className="mt-4 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.ratingDistribution[rating];

              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="w-4 text-sm text-gray-600">{rating}</span>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gray-900"
                      style={{
                        width: `${getPercentage(count)}%`,
                      }}
                    />
                  </div>

                  <span className="w-6 text-right text-xs text-gray-500">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 rounded-xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search guest or review..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
          />

          <select
            value={ratingFilter}
            onChange={(event) => setRatingFilter(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black md:w-48"
          >
            <option value="ALL">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-6 rounded-xl bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-900">
            Customer Reviews
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredReviews.length} review
            {filteredReviews.length !== 1 ? "s" : ""} shown
          </p>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-gray-900">No reviews found</p>

            <p className="mt-1 text-sm text-gray-500">
              Reviews from customers will appear here.
            </p>
          </div>
        ) : (
          <div>
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-100 px-6 py-6 last:border-0"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.user?.name}
                    </p>

                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-sm">
                        {renderStars(review.rating)}
                      </span>

                      <span className="text-xs text-gray-400">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-gray-400">
                    Review #{review.id}
                  </span>
                </div>

                <p className="mt-4 max-w-4xl leading-7 text-gray-600">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerReviews;
