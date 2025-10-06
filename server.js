import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./BACKEND/config/db.js";
import userRoutes from "./BACKEND/routes/userRoutes.js";
import postRoutes from "./BACKEND/routes/postRoutes.js";

// Load env from BACKEND/.env to match repo layout
dotenv.config({ path: path.join(process.cwd(), "BACKEND", ".env") });

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Health and basic root (no frontend linking)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Eunoia API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
