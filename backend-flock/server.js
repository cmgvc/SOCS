require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const meetingRoutes = require("./routes/meetings");

const app = express();

const PORT = process.env.PORT || 5001;
const uri = process.env.MONGO_URI;

app.use(cors({ origin: "http://localhost:3000" })); // allow frontend origin
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

// routes
app.use("/auth", authRoutes);
app.use("/meetings", meetingRoutes);
app.use("/faculty", require("./routes/faculty"));
app.use("/availabilities", require("./routes/availabilities"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});