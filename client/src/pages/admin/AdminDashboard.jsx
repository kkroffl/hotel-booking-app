import { useEffect, useState } from "react";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          throw new Error("Please log in as an admin");
        }

        const user = JSON.parse(storedUser);

        if (user.role !== "ADMIN") {
          throw new Error("Admin access required");
        }

        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              "x-user-id": user.id,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch dashboard statistics",
          );
        }

        setStats(data.stats);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      </div>
    );
  }

  const cards = [
    {
      title: "Hotels",
      value: stats.hotels,
      icon: "🏨",
    },
    {
      title: "Rooms",
      value: stats.rooms,
      icon: "🛏️",
    },
    {
      title: "Bookings",
      value: stats.bookings,
      icon: "📅",
    },
    {
      title: "Users",
      value: stats.users,
      icon: "👥",
    },
    {
      title: "Reviews",
      value: stats.reviews,
      icon: "⭐",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

        <p className="mt-2 text-gray-600">
          Manage StayNest hotels, rooms, bookings, users, and reviews.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>

              <div className="text-3xl">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
