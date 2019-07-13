'use strict'

module.exports = function (app) {
	// Initialize register Controller (Middleware)
	const register = require('../controller/register');

	// GET Request (Test the API Response)
	app.get('/manual/api_register_test', register.test);

	// POST Request Goes here
	app.post('/manual/register', register.create); // Register Function
	app.post('/manual/register_auth/:id', register.check); // Checking 6 Digit Random Number
}