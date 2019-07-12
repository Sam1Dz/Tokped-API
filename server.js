// Import Modules
const express = require('express');
const bodyParser = require('body-parser');
const time = require('moment');

// Initialize ExpressJS & BodyParser
const app = express();

app.use(
	bodyParser.urlencoded({
		extended: true
	})
)
app.use(bodyParser.json());

// Initialize All Router
const register = require('./routers/register');
const login = require('./routers/login');

register(app);
login(app);

// Server Start at PORT 5000
app.listen(5000, () => console.log('Server started at PORT "5000" [' + time().format('DD/MM/YYYY HH:mm:ss') +' UTC+7]'));