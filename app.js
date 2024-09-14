// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON bodies

// POST endpoint to receive submitted form data
app.post('/submit', (req, res) => {
  const formData = req.body;

  const dataPath = path.join(__dirname, 'data.json');

  // Read existing data, append new data, and write back to the file
  fs.readFile(dataPath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading data.json:', err);
      return res.status(500).send('Internal Server Error');
    }

    let jsonData = [];
    if (data) {
      jsonData = JSON.parse(data);
    }

    jsonData.push(formData); // Append the new form data

    fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), 'utf-8', (err) => {
      if (err) {
        console.error('Error writing to data.json:', err);
        return res.status(500).send('Internal Server Error');
      }

      console.log('Data saved successfully');
      res.status(200).send('Data saved successfully');
    });
  });
});
app.get('/data', (req, res) => {
    console.log("asf")
    const dataPath = path.join(__dirname, 'data.json');
  
    fs.readFile(dataPath, 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading data.json:', err);
        return res.status(500).send('Internal Server Error');
      }
  
      res.status(200).json(JSON.parse(data || '[]')); // Return parsed data or an empty array
    });
  });


  
const DATA_FILE = 'posts.json';

// Load existing posts from JSON file
const loadPosts = () => {
    if (fs.existsSync(DATA_FILE)) {
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf-8');
            if (data) {
                return JSON.parse(data);
            } else {
                return []; // Return empty if file is empty
            }
        } catch (error) {
            console.error("Error reading or parsing the posts file:", error);
            return []; // Return empty on error
        }
    }
    return [];
};

// Save posts to JSON file
const savePosts = (posts) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
};

// Get all posts
app.get('/api/posts', (req, res) => {
    const posts = loadPosts();
    res.json(posts);
});

// Create a new post
app.post('/api/posts', (req, res) => {
    const posts = loadPosts();
    const newPost = { id: Date.now(), ...req.body };
    posts.push(newPost);
    savePosts(posts);
    res.status(201).json(newPost);
});

// Update a post
app.put('/api/posts/:id', (req, res) => {
    const posts = loadPosts();
    const postIndex = posts.findIndex(post => post.id == req.params.id);
    if (postIndex === -1) {
        return res.status(404).send('Post not found.');
    }
    posts[postIndex] = { ...posts[postIndex], ...req.body };
    savePosts(posts);
    res.json(posts[postIndex]);
});

// Delete a post
app.delete('/api/posts/:id', (req, res) => {
    let posts = loadPosts();
    posts = posts.filter(post => post.id != req.params.id);
    savePosts(posts);
    res.status(204).send();
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});