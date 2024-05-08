const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Define API endpoints

// Sample data
const dataBunga = [
  { id: 1, nama: 'freeseas', harga: 10000, gambar: '/images/freeseas.webp' },
  { id: 2, nama: 'gardenias', harga: 15000, gambar: '/images/gardenias.webp' },
  { id: 3, nama: 'hydrangeas', harga: 10000, gambar: '/images/hydrangeas.webp' },
  { id: 4, nama: 'lily', harga: 15000, gambar: '/images/lily.webp' },
  { id: 5, nama: 'lotus', harga: 10000, gambar: '/images/lotus.webp' },
  { id: 6, nama: 'morning glory', harga: 15000, gambar: '/images/morningglory.webp' },
];

// Endpoint to fetch sample data
app.get('/api/data', (req, res) => {
  res.json(dataBunga);
});

// Sample login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  // Mock login authentication logic
  if (email === 'user@example.com' && password === 'password') {
    // For simplicity, just return success with a token
    const token = 'sample_token';
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Sample protected endpoint (requires authentication)
app.get('/api/user', authenticateToken, (req, res) => {
  // User information can be retrieved from req.user
  const user = { username: req.user.username, email: req.user.email };
  res.json(user);
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  // Extract token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // Unauthorized

  // Verify token (mocking token verification for demo)
  if (token === 'sample_token') {
    req.user = { username: 'sample_user', email: 'user@example.com' };
    next(); // Token is valid, continue to the next middleware
  } else {
    res.sendStatus(403); // Forbidden
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
