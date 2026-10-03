process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const groqChat = async (messages, tools = undefined) => {
  try {
    const body = {
      model: "openai/gpt-oss-120b",
      messages,
    };

    if (tools) {
      body.tools = tools;
      body.tool_choice = "auto";
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Groq fetch failed:", error);
    console.error("Cause:", error.cause);
    throw error;
  }
};

module.exports = groqChat;
