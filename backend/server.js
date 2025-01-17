const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Blog = require("./models/Blog.js");
const Readmore = require("./models/readmore.js");
const authRoutes = require("./routes/authRoutes.js");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware.js");
const checkRole = require("./middleware/checkRole");

const app = express();
const port = process.env.PORT || 3000;

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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, "../frontend")));

//view engine
app.set("view engine", "ejs");
// app.engine("html", require("ejs").renderFile); // Allow rendering .html files using EJS

// Define routes
// app.get("*", checkUser);

app.get("/", requireAuth, checkUser, (req, res) => {
  return res.render("Home", { user: req.user });
});
app.get("/blog", requireAuth, checkUser, (req, res) => {
  return res.render("Blog", { user: req.user });
});
app.get("/ContactUs", requireAuth, checkUser, (req, res) => {
  return res.render("ContactUs", { user: req.user });
});
app.get("/Offers", requireAuth, checkUser, (req, res) => {
  return res.render("Offers", { user: req.user });
});
app.get("/Services", requireAuth, checkUser, (req, res) => {
  return res.render("Services", { user: req.user });
});
app.get("/Readmore", requireAuth, checkUser, (req, res) => {
  return res.render("Readmore", { user: req.user });
});

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

//  API endpoint to fetch readmore
app.get("/api/readmore/:id", async (req, res) => {
  console.log("GET /api/readmore called");
  try {
    const readmore = await Readmore.find({});
    console.log("Readmore retrieved:", readmore);
    res.json(readmore);
  } catch (err) {
    console.error("Error retrieving readmore:", err.message);
    res.status(500).send({ error: "Failed to retrieve readmore" });
  }
});

async function checkBlogOwnership(req, res, next) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    if (!blog.createdBy.equals(req.user.id)) {
      return res
        .status(403)
        .send("Forbidden: You can only edit or delete your own blogs");
    }

    next();
  } catch (err) {
    console.error("Error checking blog ownership:", err.message);
    res.status(500).send("Server Error");
  }
}

app.get(
  "/edit-blog/:id",
  checkUser,
  checkRole("subscriber"),
  async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).send("Blog not found");
      }
      res.render("edit-blog", { blog, user: req.user });
    } catch (err) {
      console.error("Error fetching blog:", err.message);
      res.status(500).send("Server Error");
    }
  }
);

// app.get("/edit-blog", async (req, res) => {
//   res.render("edit-blog");
// });

// Route to edit an existing blog (restricted to subscribers)
app.put(
  "/api/blogs/:id",
  checkUser,
  checkRole("subscriber"),
  checkBlogOwnership,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedBlogData = req.body;
      const updatedBlog = await Blog.findByIdAndUpdate(id, updatedBlogData, {
        new: true,
      });

      if (!updatedBlog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      res
        .status(200)
        .json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (err) {
      console.error("Error updating blog:", err.message);
      res
        .status(500)
        .json({ error: "Failed to update blog", details: err.message });
    }
  }
);

// DELETE route for deleting a blog
app.delete(
  "/api/blogs/:id",
  requireAuth,
  checkBlogOwnership,
  async (req, res) => {
    const blogId = req.params.id;

    try {
      const blog = await Blog.findByIdAndDelete(blogId);

      if (!blog) {
        return res.status(404).send({ error: "Blog not found" });
      }

      res.status(200).send({ message: "Blog deleted successfully" });
    } catch (err) {
      console.error("Error deleting blog:", err.message);
      res
        .status(500)
        .send({ error: "Failed to delete blog", details: err.message });
    }
  }
);

// create new blog
app.get("/create-blog", checkUser, (req, res) => {
  res.render("create-blog", { user: req.user });
});

// Route to handle form submission and create a new blog
app.post(
  "/api/blogs",
  requireAuth,
  checkRole("subscriber"),
  async (req, res) => {
    try {
      const { title, imageUrl, excerpt } = req.body;
      console.log(req.body);
      const newBlog = new Blog({
        title,
        imageUrl,
        excerpt,
        createdBy: req.user.id, // Associate the blog with the user creating it
      });
      await newBlog.save();
      res.redirect("/Blog");
    } catch (err) {
      console.error("Error creating blog:", err.message);
      res
        .status(500)
        .send({ error: "Failed to create blog", details: err.message });
    }
  }
);

// Route to display blogs on the homepage
app.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.render("index", { blogs });
  } catch (err) {
    console.error("Error retrieving blogs:", err.message);
    res.status(500).send({ error: "Failed to retrieve blogs" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
