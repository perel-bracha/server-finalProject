import http from 'http';
import url from 'url';
import axios from 'axios';
import dotenv from 'dotenv';

// the function recieves an address and returns the coordinates




dotenv.config();

const PORT = process.env.PORT || 3001;
const ORS_API_KEY = process.env.ORS_API_KEY;

if (!ORS_API_KEY) {
  console.error('Error: ORS_API_KEY not set in environment variables.');
  process.exit(1);
}

/**
 * Parse a coordinate string 'lat,lng' into [lat, lng] numbers.
 */
function parseCoords(coordStr) {
  const parts = coordStr.split(',').map(Number);
  if (parts.length !== 2 || parts.some(isNaN)) {
    throw new Error('Invalid coordinate format. Use lat,lng');
  }
  return parts;
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (req.method === 'GET' && parsedUrl.pathname === '/api/travel-time') {
    const { origin, dest } = parsedUrl.query;
    if (!origin || !dest) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'יש לספק origin ו-dest ב־query string' }));
      return;
    }

    let lat1, lon1, lat2, lon2;
    try {
      [lat1, lon1] = parseCoords(origin);
      [lat2, lon2] = parseCoords(dest);
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: err.message }));
      return;
    }

    try {
      const orsRes = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        { coordinates: [[lon1, lat1], [lon2, lat2]] },
        { headers: { Authorization: ORS_API_KEY, 'Content-Type': 'application/json' } }
      );

      const route = orsRes.data.routes[0];
      const payload = { distance_m: route.summary.distance, duration_s: route.summary.duration };

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(payload));
    } catch (err) {
      console.error(err.response?.data || err.message);
      const msg = err.response?.data?.error?.message || 'בקשת ORS נכשלה';
      res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: msg }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'נתיב לא נמצא' }));
  }
});

server.listen(PORT, () => {
  console.log(`השרת רץ ב-http://localhost:${PORT}`);
});
