require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const API_KEY = process.env.OPENROUTER_API_KEY;  
const BASE_URL = "https://openrouter.ai/api/v1/chat/completions";  

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;
        console.log("User Message:", userMessage);

        const response = await axios.post(BASE_URL, {
            model: "google/gemini-2.0-flash-thinking-exp:free",  // 🔹 Google Gemini Model
            messages: [{ role: "user", content: userMessage }]
        }, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        console.log("AI Response:", response.data);
        res.json(response.data.choices[0].message);
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});
