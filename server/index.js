const express = require("express");
const cors = require("cors");
const articleRoutes = require("./routes/articleRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const path = require("path");

const app = express();
const port = 3001;

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // ganti jika frontend beda domain
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/article", articleRoutes);
app.use("/gallery", galleryRoutes); // ✅ gunakan modular route

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
