const express = require('express');
const { toLatLon, headingDistanceTo } = require('geolocation-utils');
const { routes: routesInJson } = require('./data.json');

const app = express();
app.use(express.json());

app.get('/routes', (req, res) => {
  const routes = routesInJson.map(route => {
    const { id, vehicle, timestamp } = route;
    return { id, vehicle, timestamp };
  });

  res.json(routes);
});

app.get('/routes/:id', (req, res) => {
  const { id } = req.params;
  const route = routesInJson.find(route => route.id === id);

  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }

  res.json(route.locations);
});

app.get('/distance', (req, res) => {
    const { start, end } = req.query;

    if(!start) {
      return res.status(400).json({ error: 'start parameter is missing' });
    }

    if(!end) {
      return res.status(400).json({ error: 'end parameter is missing' });
    }

    if(new Date(end) <= new Date(start)){
      return res.status(400).json({ error: 'end parameter should be in the future of start parameter' });
    }

    const startTimestamp = new Date(start);
    const endTimestamp = new Date(end);

    if(isNaN(startTimestamp.getTime())) {
      return res.status(400).json({ error: 'start parameter is an invalid date' });
    }

    if(isNaN(endTimestamp.getTime())) {
      return res.status(400).json({ error: 'end parameter is an invalid date' });
    }
  
    let totalDistance = 0;
    routesInJson.forEach(route => {
      const routeTimestamp = new Date(route.timestamp);

      if (routeTimestamp >= startTimestamp && routeTimestamp <= endTimestamp) {
        let distance = 0;
        for (let i = 0; i < route.locations.length - 1; i++) {
          const location1 = toLatLon([route.locations[i].coords.longitude, route.locations[i].coords.latitude]);
          const location2 = toLatLon([route.locations[i + 1].coords.longitude, route.locations[i + 1].coords.latitude]);
          distance += headingDistanceTo(location1, location2).distance;
        }
        totalDistance += distance;
      }
    });
  
    res.json({ totalDistance });
  });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;
