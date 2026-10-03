const searchHotelsTool = {
  type: "function",
  function: {
    name: "searchHotels",
    description:
      "Search StayNest hotels by city, maximum room price, and minimum hotel rating.",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: ["string", "null"],
          description: "The city where the user wants to stay. Optional.",
        },
        maxPrice: {
          type: ["number", "null"],
          description:
            "Maximum price per night the user wants to pay. Use null if the user did not specify a maximum price.",
        },
        minRating: {
          type: ["number", "null"],
          description:
            "Minimum hotel rating from 1 to 5. Use null if the user did not specify a minimum rating.",
        },
      },
      required: ["city", "maxPrice", "minRating"],
    },
  },
};

const getHotelDetailsTool = {
  type: "function",
  function: {
    name: "getHotelDetails",
    description:
      "Get detailed information about a specific StayNest hotel, including its description, rooms, prices, rating, and customer reviews.",
    parameters: {
      type: "object",
      properties: {
        hotelId: {
          type: "number",
          description: "The ID of the StayNest hotel.",
        },
      },
      required: ["hotelId"],
    },
  },
};

const checkAvailabilityTool = {
  type: "function",
  function: {
    name: "checkAvailability",
    description:
      "Check whether a specific hotel room is available for given check-in and check-out dates and number of guests.",
    parameters: {
      type: "object",
      properties: {
        roomId: {
          type: "number",
          description: "The ID of the room to check.",
        },
        checkIn: {
          type: "string",
          description: "Check-in date in YYYY-MM-DD format.",
        },
        checkOut: {
          type: "string",
          description: "Check-out date in YYYY-MM-DD format.",
        },
        guests: {
          type: "number",
          description: "Number of guests.",
        },
      },
      required: ["roomId", "checkIn", "checkOut", "guests"],
    },
  },
};

const searchAvailableRoomsTool = {
  type: "function",
  function: {
    name: "searchAvailableRooms",
    description:
      "Find available rooms at a specific StayNest hotel for given dates and number of guests. Optionally filter by maximum price per night.",
    parameters: {
      type: "object",
      properties: {
        hotelId: {
          type: "number",
          description: "The ID of the hotel.",
        },
        checkIn: {
          type: "string",
          description: "Check-in date in YYYY-MM-DD format.",
        },
        checkOut: {
          type: "string",
          description: "Check-out date in YYYY-MM-DD format.",
        },
        guests: {
          type: "number",
          description: "Number of guests.",
        },
        maxPrice: {
          type: ["number", "null"],
          description:
            "Maximum price per night. Use null if the user did not specify a maximum price.",
        },
      },
      required: ["hotelId", "checkIn", "checkOut", "guests", "maxPrice"],
    },
  },
};

module.exports = {
  searchHotelsTool,
  getHotelDetailsTool,
  checkAvailabilityTool,
  searchAvailableRoomsTool,
};
