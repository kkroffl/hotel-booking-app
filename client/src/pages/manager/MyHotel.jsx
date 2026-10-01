import { useEffect, useState } from "react";

function MyHotel() {
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    latitude: "",
    longitude: "",
    image: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch("http://localhost:5000/api/manager/hotel", {
      headers: {
        "x-user-id": user.id,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setHotel(data.hotel);

          setFormData({
            name: data.hotel.name || "",
            description: data.hotel.description || "",
            address: data.hotel.address || "",
            city: data.hotel.city || "",
            country: data.hotel.country || "",
            latitude: data.hotel.latitude ?? "",
            longitude: data.hotel.longitude ?? "",
            image: data.hotel.image || "",
          });
        } else {
          setError(data.message);
        }
      })
      .catch(() => {
        setError("Failed to load hotel");
      });
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await fetch("http://localhost:5000/api/manager/hotel", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          latitude: formData.latitude === "" ? null : Number(formData.latitude),
          longitude:
            formData.longitude === "" ? null : Number(formData.longitude),
          image: formData.image,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setHotel(data.hotel);
        setEditing(false);
      } else {
        setError(data.message || "Failed to update hotel");
      }
    } catch {
      setError("Failed to update hotel");
    } finally {
      setSaving(false);
    }
  };

  if (error && !hotel) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!hotel) {
    return <div>Loading hotel...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Hotel</h1>

          <p className="mt-1 text-gray-500">Manage your hotel information</p>
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Edit Hotel
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {editing ? (
        <form
          onSubmit={handleSave}
          className="mt-8 rounded-xl bg-white p-6 shadow"
        >
          <h2 className="text-xl font-bold text-gray-900">
            Edit Hotel Information
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Hotel Name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Country
              </label>

              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>

              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">City</label>

              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Image URL
              </label>

              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Latitude
              </label>

              <input
                name="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Longitude
              </label>

              <input
                name="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="mt-8 overflow-hidden rounded-xl bg-white shadow">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="h-64 w-full object-cover"
            />

            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {hotel.name}
                  </h2>

                  <p className="mt-2 text-gray-500">
                    {hotel.address}, {hotel.city}, {hotel.country}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-100 px-4 py-2">
                  ⭐ {hotel.rating ?? "No rating"}
                </div>
              </div>

              <p className="mt-6 leading-7 text-gray-600">
                {hotel.description}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-sm text-gray-500">Room Types</p>
              <p className="mt-2 text-3xl font-bold">{hotel.rooms.length}</p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-sm text-gray-500">Reviews</p>
              <p className="mt-2 text-3xl font-bold">{hotel.reviews.length}</p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-sm text-gray-500">Manager</p>
              <p className="mt-2 font-semibold">You</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MyHotel;
