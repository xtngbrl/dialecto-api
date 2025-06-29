const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loadDbPermission = require('./middleware/loadUserPermissionMiddleware');
const appRoutes = require('./routes/appRoutes');
const dbCommandRoutes = require('./routes/migrationRoutes');
const db = require('./models');

const app = express();

require('dotenv').config();

const PORT = process.env.PORT;

// app.options('*', cors());
// app.use(cors());

// Allow both localhost and hosted domain
const allowedOrigins = [
    'http://localhost:5173',
    'https://www.dialecto-app.com'
];

app.use(cors({
    origin: function (origin, callback) {
        // check for origins
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(bodyParser.json());
app.use(loadDbPermission);
app.use('/api', appRoutes);
app.use('/db', dbCommandRoutes);

app.get('/', function (req, res) {
    const htmlResponse = `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Development Server</title>
                  <style>
                      body {
                          display: flex;
                          flex-direction: column;
                          justify-content: center;
                          align-items: center;
                          height: 100vh;
                          margin: 0;
                          font-family: Arial, sans-serif;
                          background-color: #f4f4f9;
                          color: #333;
                      }
                      h1 {
                          font-size: 3rem;
                          color: #4CAF50;
                          margin-bottom: 20px;
                      }
                      p {
                          font-size: 1.2rem;
                          margin: 10px 0;
                      }
                      footer {
                          position: absolute;
                          bottom: 10px;
                          font-size: 0.9rem;
                          color: #666;
                      }
                      a {
                          color: #4CAF50;
                          text-decoration: none;
                          font-weight: bold;
                      }
                  </style>
              </head>
              <body>
                  <h1>Development Server is Running 🚀</h1>
                  <p>Welcome to the backend of your awesome project!</p>
                  <p>Stay productive and build something amazing. 💻✨</p>
                  <footer>
                      <p>Powered by <a href="https://nodejs.org" target="_blank">Node.js</a>.</p>
                  </footer>
              </body>
              </html>
          `;
    res.send(htmlResponse);
  });

app.listen(PORT)

// Internal keep-alive ping every 13 minutes
const http = require('http');
const KEEP_ALIVE_INTERVAL = 13 * 60 * 1000; // 13 minutes in ms

setInterval(() => {
  const options = {
    hostname: 'localhost',
    port: PORT,
    path: '/api/ping',
    method: 'GET',
  };
  const req = http.request(options, (res) => {
    // Optionally log status
    console.log(`Keep-alive ping: ${res.statusCode}`);
  });
  req.on('error', (error) => {
    // Optionally log error
    console.error('Keep-alive ping error:', error);
  });
  req.end();
}, KEEP_ALIVE_INTERVAL);

