const groqChat = require("../groq");

const {
  searchHotels,
  getHotelDetails,
  checkAvailability,
} = require("../tools/hotelTools");

const {
  searchHotelsTool,
  getHotelDetailsTool,
  checkAvailabilityTool,
} = require("../tools/toolDefinitions");

const tools = [searchHotelsTool, getHotelDetailsTool, checkAvailabilityTool];

const chatWithGroq = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Message is required",
      });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are the StayNest AI assistant. Help users find hotels and answer questions about StayNest using real database information. " +
          "When you need hotel information, use the available tools. " +
          "If you identify a hotel and need more details, call getHotelDetails using the hotel ID. " +
          "Never invent hotel information. " +
          "After receiving all necessary tool results, answer the user clearly using only the available data.",
      },
      {
        role: "user",
        content: message,
      },
    ];

    while (true) {
      const response = await groqChat(messages, tools);

      const assistantMessage = response.choices[0].message;

      messages.push(assistantMessage);

      if (!assistantMessage.tool_calls?.length) {
        return res.json({
          status: "success",
          message: assistantMessage.content,
        });
      }

      for (const toolCall of assistantMessage.tool_calls) {
        const args = JSON.parse(toolCall.function.arguments);

        let results;

        if (toolCall.function.name === "searchHotels") {
          results = await searchHotels(args);
        } else if (toolCall.function.name === "getHotelDetails") {
          results = await getHotelDetails(args);
        } else if (toolCall.function.name === "checkAvailability") {
          results = await checkAvailability(args);
        } else {
          throw new Error(`Unknown tool: ${toolCall.function.name}`);
        }

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(results),
        });
      }
    }
  } catch (error) {
    console.error("Groq API error:", error);

    res.status(500).json({
      status: "error",
      message: error.message || "Failed to get AI response",
    });
  }
};

module.exports = {
  chatWithGroq,
};
