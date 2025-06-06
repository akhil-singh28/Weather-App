import http from "http";
import fetch from "node-fetch";
import dotenv from "dotenv";
import connect from "connect";
import cors from "cors";
import App from "../frontend/src/App";

dotenv.config();

const API_KEY = process.env.WEATHER_API_KEY='378007afc852461ea6771259250804'
;
const PORT = 3000;

const app = connect();
app.use(cors());

app.use(async (req, res) => {
  if (req.url.startsWith('/weather') && req.method === 'GET') {
    const city = new URLSearchParams(req.url.split('?')[1]).get('city') || 'London';
    console.log(city);
    try {
      const weatherUrl = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`;
      const response = await fetch(weatherUrl);
      const data = await response.json();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch weather data' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found');
  }
});

http.createServer(app).listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`)
);