import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Message from "./models/message.js";  

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow Specific Frontend Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://joyful-ganache-50026a.netlify.app",
  "https://glittering-clafoutis-104fa7.netlify.app" ,
  "https://aesthetic-bombolone-0268dc.netlify.app" // ✅  new Netlify link
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); 
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Test Route to Check Backend Status
app.get("/", (req, res) => {
  res.send("Hello, Backend is Running!");
});

// ✅ Direct POST Route (Instead of external route file)
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    res.status(201).json({ success: true, message: "Message saved successfully!" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
