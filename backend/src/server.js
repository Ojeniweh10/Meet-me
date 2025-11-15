import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { connectDB } from "./lib/db.js";

dotenv.config();
const PORT = process.env.PORT || 3000; //using 3000 as default value in case env file is unavailable
const app = express();

// ---------- CORS Setup ----------
app.use(
  cors({
    origin: ["http://localhost:5173", "https://meet-me-two.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ----------Rate Limiting ----------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // max 100 requests per IP per windowMs
  standardHeaders: true, // return rate limit info in headers
  legacyHeaders: false, // disable X-RateLimit-* headers
});
app.use(limiter);

// ----------Middleware ----------
app.use(express.json()); //under req.body

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
  console.log("Server running at port: " + PORT);
  connectDB();
});
