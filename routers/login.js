'use strict'

module.exports = function (app) {
	// Initialize login Controller (Middleware)
	const login = require('../controller/login');

	// GET Request (Test the API Response)
	app.get('/manual/api_login_test', login.test);

	// POST Request Goes Here
	app.post('/manual/login', login.user); // Login Function
	app.post('/manual/login_auth/:id', login.check); // Checking 6 Digit Random Number
}