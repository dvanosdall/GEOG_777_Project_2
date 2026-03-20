/**
 * Name: dvanosdall
 * Date: 2026-03-20
 * Class: GEOG777
 *
 * Description: Entry point for the Node.js/Express backend.
 * Serves HTML, CSS, JS, and resources from the project folders,
 * sets up API routes, and handles CORS and JSON parsing.
 * Use this to start your server via `npm run dev` or similar.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import your API routes
const apiRoutes = require('./api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files (static HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../../html')));
app.use('/css', express.static(path.join(__dirname, '../../css')));
app.use('/js', express.static(path.join(__dirname, '../../js')));
app.use('/resources', express.static(path.join(__dirname, '../../resources')));

// API endpoints
app.use('/api', apiRoutes);

// Root route (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../html/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});