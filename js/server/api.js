/**
 * Name: dvanosdall
 * Date: 2026-03-20
 * Class: GEOG777
 *
 * This file defines API endpoints for the park web app backend.
 * It connects to a PostgreSQL database (GEOG777_ParkDB), returning data about park features, handling submissions,
 * and offering routes for testing API and database connectivity.
 */

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Setup connection pool using env config
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Basic API test endpoint
router.get('/test', (req, res) => {
  res.json({ status: 'API working' });
});

// Database connection test endpoint
router.get('/dbtest', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'DB connected', serverTime: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example: Fetch features (expand as needed)
router.get('/features', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM feature LIMIT 25;');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example: Fetch trails (expand as needed)
router.get('/trails', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trail LIMIT 25;');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example: Fetch facilities (expand as needed)
router.get('/facilities', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM facility LIMIT 25;');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user_submission: Accept user submissions
router.post('/user_submission', async (req, res) => {
  const { email, content, lng, lat } = req.body;

  if (
    !email ||
    !content ||
    typeof lng !== 'number' ||
    typeof lat !== 'number'
  ) {
    return res.status(400).json({ error: 'Missing or invalid parameters.' });
  }

  try {
    const parkId = 1; // park_id for Mahoney
    const result = await pool.query(
      `
      INSERT INTO user_submission (park_id, email, content, geom)
      VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326))
      RETURNING submission_id, park_id, email, content, timestamp;
      `,
      [parkId, email, content, lng, lat]
    );
    res.json({
      success: true,
      submission: result.rows[0]
    });
  } catch (err) {
    console.error('User submission error:', err);
    res.status(500).json({ error: 'Failed to insert submission.' });
  }
});

// More routes here (GET trails, facilities, etc.)

module.exports = router;