'use strict'

module.exports = function (app) {
	// Initialize login Controller (Middleware)
	const user = require('../controller/user');

	// GET Request (Test the API Response)
	app.get('/manual/api_user_test', user.test);

	// POST Request Goes Here
	app.post('/manual/upload_pp/:id', user.ppUpload); // Upload Photo Profile Image Function 
}