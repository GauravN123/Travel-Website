const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Blog = require("./models/Blog.js");
const authRoutes = require("./routes/authRoutes.js");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware.js");
const app = express();
const port = 3000;

// Connect to MongoDB
const uri = "mongodb+srv://Gaurav:welcome123@cluster0.93ry3pd.mongodb.net/blog";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, "../frontend")));

//view engine
app.set("view engine", "ejs");
// app.engine("html", require("ejs").renderFile); // Allow rendering .html files using EJS

// Define routes
app.get("*", checkUser);

// app.get("/", requireAuth, (req, res) => {
//   res.sendFile(path.join(__dirname, "./views/Home.ejs"));
// });
app.get("/", (req, res) => res.render("Home"));
app.get("/Blog", requireAuth, (req, res) => res.render("Blog"));
app.get("/ContactUs", requireAuth, (req, res) => res.render("ContactUs"));
app.get("/Offers", requireAuth, (req, res) => res.render("Offers"));
app.get("/Services", requireAuth, (req, res) => res.render("Services"));

// app.get("/", requireAuth, (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/Blog.html"));
// });
app.use(authRoutes);

// API endpoint to fetch blogs
app.get("/api/blogs", async (req, res) => {
  console.log("GET /api/blogs called");
  try {
    const blogs = await Blog.find({});
    console.log("Blogs retrieved:", blogs);
    res.json(blogs);
  } catch (err) {
    console.error("Error retrieving blogs:", err.message);
    res.status(500).send({ error: "Failed to retrieve blogs" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
