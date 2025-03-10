require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Allow CORS only for local testing
const corsOptions = {
    origin: "*",
    methods: "GET,POST"
};
app.use(cors(corsOptions));

const API_KEY = process.env.OPENROUTER_API_KEY;
const BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

if (!API_KEY) {
    console.error("❌ ERROR: OPENROUTER_API_KEY is missing in .env file!");
    process.exit(1);
}

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: "User message is required" });
        }

        console.log("User Message:", userMessage);

        const response = await axios.post(BASE_URL, {
            model: "google/gemini-2.0-flash-lite-preview-02-05:free",
            messages: [{ role: "user", content: userMessage }],
        }, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        res.json({ content: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.error || "Internal Server Error"
        });
    }
});

app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});
