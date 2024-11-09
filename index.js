const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const loadDbPermission = require('./middleware/loadUserPermissionMiddleware');
const appRoutes = require('./routes/appRoutes');
const db = require('./models');

const app = express();

require('dotenv').config();

const PORT = process.env.PORT;

app.options('*', cors());
app.use(cors({ 
    /*origin: 'https://revivepharmacyportal.com.au/',*/
    credentials: true
}));
app.use(bodyParser.json());
app.use(loadDbPermission);
app.use('/api', appRoutes);

app.get  ('/', function (req, res){
    res.send('Server is running');
})

app.listen(PORT)

