require('dotenv').config();
const express = require('express');
const axios   = require('axios');
const app     = express();
app.use(express.json());

/**
 * GET /api/travel-time
 * פרמטרים:
 *   origin = lat,lng
 *   dest   = lat,lng
 */
app.get('/api/travel-time', async (req, res) => {
  const { origin, dest } = req.query;
  if (!origin || !dest) {
    return res.status(400).json({ error: 'יש לספק origin ו-dest' });
  }

  const [lat1, lon1] = origin.split(',').map(Number);
  const [lat2, lon2] = dest.split(',').map(Number);

  try {
    const orsRes = await axios.post(
      'https://api.openrouteservice.org/v2/directions/driving-car',
      {
        coordinates: [
          [lon1, lat1],  // שימו לב: ORS דורש [lng, lat]
          [lon2, lat2]
        ]
      },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const route = orsRes.data.routes[0];
    res.json({
      distance_m: route.summary.distance,
      duration_s: route.summary.duration
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    const msg = err.response?.data?.error?.message || 'בקשת ORS נכשלה';
    res.status(502).json({ error: msg });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`השרת רץ ב-http://localhost:${PORT}`));
