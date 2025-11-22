import axios from "axios";

export const findMatches = async (req, res) => {
  const { sport } = req.body;

  try {
    if (sport === "Cricket") {
      const response = await axios.get(
        "https://api.cricapi.com/v1/currentMatches",
        {
          params: { apikey: process.env.CRICAPI_TOKEN },
        },
      );

      return res.json(response.data.data);
    }

    return res
      .status(400)
      .json({ error: "Unknown sport - only Cricket is supported" });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "API error" });
  }
};
