require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const app = express();

// --- middleware ---
app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      "http://localhost:5173",
      "https://selection.vishwaplyandhardware.com"
    ];
    if (!origin || allowed.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: "8mb" })); // larger limit so base64 product images fit
app.use(morgan("dev"));

// --- routes ---
app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/selections", require("./routes/selectionRoutes"));

app.get("/", (req, res) => res.json({ status: "Plywood Showroom API running" }));

// --- start ---
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
});
