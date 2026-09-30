import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateHotel() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    latitude: "",
    longitude: "",
    image: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await fetch("http://localhost:5000/api/manager/hotel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.status !== "success") {
        setError(data.message || "Failed to create hotel");
        return;
      }

      navigate("/manager");
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900">Create Your Hotel</h1>

      <p className="mt-2 text-gray-500">
        Add your hotel details to get started.
      </p>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-xl bg-white p-6 shadow"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Hotel Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border px-4 py-3"
              placeholder="StayNest Grand"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Country</label>
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border px-4 py-3"
              placeholder="India"
            />
          </div>

          <div>
            <label className="text-sm font-medium">City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border px-4 py-3"
              placeholder="Chennai"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border px-4 py-3"
              placeholder="OMR Road"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Latitude</label>
            <input
              name="latitude"
              type="number"
              step="any"
              value={form.latitude}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Longitude</label>
            <input
              name="longitude"
              type="number"
              step="any"
              value={form.longitude}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows="4"
            className="mt-2 w-full rounded-lg border px-4 py-3"
            placeholder="Describe your hotel..."
          />
        </div>

        <div>
          <label className="text-sm font-medium">Hotel Image URL</label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border px-4 py-3"
            placeholder="https://..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Hotel"}
        </button>
      </form>
    </div>
  );
}

export default CreateHotel;
