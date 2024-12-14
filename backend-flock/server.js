require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const meetingRoutes = require("./routes/meetings");
const availabilityRoutes = require("./routes/availability");
const facultyRoutes = require("./routes/faculty");
const availabilitiesRoutes = require("./routes/availabilities");

const app = express();

const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin:"http://localhost:3000",
    credentials: true,
  })
); // allow frontend origin
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
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
app.use("/availability", availabilityRoutes);
app.use("/faculty", facultyRoutes);
app.use("/availabilities", availabilitiesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
