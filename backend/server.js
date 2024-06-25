const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Blog = require('../backend/Blog.js'); 

const app = express();
const port = 3000;

// MongoDB connection URI
// const uri = 'mongodb+srv://Gaurav:welcome123@cluster0.93ry3pd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const uri = 'mongodb+srv://Gaurav:welcome123@cluster0.93ry3pd.mongodb.net/travel';

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/Blog.html'));
});

// API endpoint to fetch blogs
app.get('/api/blogs', async (req, res) => {
    console.log('GET /api/blogs called');
    try {
      const blogs = await Blog.find({});
      console.log('Blogs retrieved:', blogs);
      res.json(blogs);
    } catch (err) {
      console.error('Error retrieving blogs:', err.message);
      res.status(500).send({ error: 'Failed to retrieve blogs' });
    }
  });

//   app.post('/api/blogs', async (req, res) => {
//     const { title, content } = req.body;
  
//     try {
//       const newBlog = new Blog({ title, content });
//       await newBlog.save();
//       res.status(201).json(newBlog);
//     } catch (err) {
//       console.error('Error creating blog:', err.message);
//       res.status(500).send({ error: 'Failed to create blog' });
//     }
//   });
  

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
