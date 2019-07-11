'use strict'

module.exports = function (app) {
	// Initialize All Controller (Middleware)
	const register = require('../controller/register');

	// GET Request (Test the API Response)
	app.get('/manual/api_register_test', register.test);

	// POST Request Goes here
	app.post('/manual/register', register.create); // Send Email to Register
}