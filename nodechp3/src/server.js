import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

const app = express();
const PORT = process.env.PORT || 1998;
app.use(express.json());

app.listen(PORT, () => {
  console.log(`server listening to ${PORT}`);
});

//send back a frontend

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//middleware

app.use(express.static(path.join(__dirname, "../public")));

//GET

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//auth

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);
