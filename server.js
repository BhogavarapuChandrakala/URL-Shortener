const express = require('express');
const shortId = require('shortid'); // Use shortid for generating unique short URLs
const app = express();

// In-memory storage for URLs (for demonstration purposes)
const shortUrls = []; // Array to store URL mappings

// Express settings
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
  // Render the index page with short URLs
  res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', (req, res) => {
  // Create a new short URL
  const fullUrl = req.body.fullUrl;
  const shortUrl = {
    full: fullUrl,
    short: shortId.generate(),
    clicks: 0
  };
  
  shortUrls.push(shortUrl); // Store it in the in-memory array
  res.redirect('/'); // Redirect immediately
});

app.get('/:shortUrl', (req, res) => {
  // Find the short URL
  const shortUrl = shortUrls.find(url => url.short === req.params.shortUrl);
  
  if (!shortUrl) {
    return res.sendStatus(404); // Handle not found
  }

  shortUrl.clicks++; // Increment the click count
  res.redirect(shortUrl.full); // Redirect to the full URL
});

// This will be your Vercel serverless function handler
module.exports = app;

// Vercel will use this to handle requests
if (require.main === module) {
  // Use a different port if 4240 is unavailable
  const PORT = process.env.PORT || 4240;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
