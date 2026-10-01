import { useCallback, useEffect, useState } from "react";

function ManagerRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "",
    totalRooms: "",
    image: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchRooms = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/manager/rooms", {
        headers: {
          "x-user-id": user.id,
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        setRooms(data.rooms);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    let cancelled = false;

    const loadRooms = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/manager/rooms",
          {
            headers: {
              "x-user-id": user.id,
            },
          },
        );

        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (data.status === "success") {
          setRooms(data.rooms);
        } else {
          setError(data.message);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load rooms");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRooms();

    return () => {
      cancelled = true;
    };
  }, [user.id]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const openAddForm = () => {
    setEditingRoom(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      capacity: "",
      totalRooms: "",
      image: "",
    });

    setShowForm(true);
  };

  const openEditForm = (room) => {
    setEditingRoom(room);

    setFormData({
      name: room.name,
      description: room.description,
      price: room.price,
      capacity: room.capacity,
      totalRooms: room.totalRooms,
      image: room.image,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingRoom(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingRoom
        ? `http://localhost:5000/api/manager/rooms/${editingRoom.id}`
        : "http://localhost:5000/api/manager/rooms";

      const method = editingRoom ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          capacity: Number(formData.capacity),
          totalRooms: Number(formData.totalRooms),
          image: formData.image,
        }),
      });

      const data = await response.json();

      if (data.status !== "success") {
        setError(data.message);
        return;
      }

      closeForm();
      await fetchRooms();
    } catch {
      setError(editingRoom ? "Failed to update room" : "Failed to create room");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (roomId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this room?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/manager/rooms/${roomId}`,
        {
          method: "DELETE",
          headers: {
            "x-user-id": user.id,
          },
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        await fetchRooms();
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to delete room");
    }
  };

  if (loading) {
    return <div>Loading rooms...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rooms</h1>

          <p className="mt-1 text-gray-500">
            Manage the rooms available at your hotel
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add Room
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {editingRoom ? "Edit Room" : "Add Room"}
            </h2>

            <button
              onClick={closeForm}
              className="text-gray-500 hover:text-gray-900"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Room Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Price per Night
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Capacity
                </label>

                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Total Rooms
                </label>

                <input
                  type="number"
                  name="totalRooms"
                  value={formData.totalRooms}
                  onChange={handleChange}
                  min="1"
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
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
                  rows="4"
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingRoom
                    ? "Update Room"
                    : "Create Room"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="overflow-hidden rounded-xl bg-white shadow"
          >
            <img
              src={room.image}
              alt={room.name}
              className="h-48 w-full object-cover"
            />

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900">{room.name}</h2>

                <span className="whitespace-nowrap text-lg font-semibold">
                  ₹{room.price.toLocaleString()}
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {room.description}
              </p>

              <div className="mt-4 flex justify-between text-sm text-gray-600">
                <span>Capacity: {room.capacity}</span>

                <span>Total Rooms: {room.totalRooms}</span>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => openEditForm(room)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(room.id)}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagerRooms;
