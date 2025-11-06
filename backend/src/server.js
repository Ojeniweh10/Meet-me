import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
dotenv.config();
const PORT = process.env.PORT || 3000; //using 3000 as default value in case env file is unavailable
const HOST = "localhost";
const app = express();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => console.log(`Server running at http://${HOST}:${PORT}`));
