require('dotenv').config();
const express = require('express');
const mbx     = require('@mapbox/mapbox-sdk/services/directions');
const directions = mbx({ accessToken: process.env.MAPBOX_TOKEN });
const app     = express();
app.use(express.json());

app.get('/api/travel-time', async (req, res) => {
  const { origin, dest } = req.query;
  if (!origin || !dest) {
    return res.status(400).json({ error: 'origin ו-dest דרושים' });
  }

  const [lat1, lon1] = origin.split(',').map(Number);
  const [lat2, lon2] = dest.split(',').map(Number);

  try {
    const rsp = await directions.getDirections({
      profile: 'driving',
      waypoints: [
        { coordinates: [lon1, lat1] },
        { coordinates: [lon2, lat2] }
      ]
    }).send();

    const route = rsp.body.routes[0];
    res.json({
      distance_m: route.distance,
      duration_s: route.duration
    });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Mapbox error' });
  }
});

app.listen(process.env.PORT, () => 
  console.log(`Server רץ ב־http://localhost:${process.env.PORT}`));
