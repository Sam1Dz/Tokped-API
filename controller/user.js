'use strict'

// Import Modules & Database Connection
require('dotenv').config();
const multer = require('multer');
const connection = require('../connect');

// Store Image after selecting Image from Phone Gallery
const storage = multer.diskStorage({
	destination: function(req, file, cb) { // Upload Destination
		cb(null, 'controller/')
	},
	filename: function(req, file, cb) { // Get Image Name
		console.log(file)
		cb(null, file.originalname)
	}
});

/* ↓ MIDDLEWARE FUNCTION ↓ */

// Test API Function
exports.test = function (req, res) {
	res.json({
		error: false,
		message: 'User API Connect Successfuly'
	})
}

// Upload + Save Image to Cloudinary & Save URL Image to Database
exports.ppUpload = function (req, res, next) {
	let id_user = req.params.id;
	const upload = multer({ storage }).single('image')
	
	connection.query(
		`SELECT COUNT(id_user) AS total FROM tb_user WHERE id_user=?`,
		[id_user],
		function (err, rows) {
			if (err) {
				res.json({ error: true, message: err });
			} else {
				let total = Math.ceil(rows[0].total);
				if (total === 0) { // If User Doesn't exists
					res.json({ error: true, message: 'User not Found' });
				} else { // If exists
					upload(req, res, function(err) {
					
						if (err) {
							res.json({ error: true, detail: err });
						} else {
							if (req.file == undefined) { // If no Image are Uploaded
								res.json({ error: true, detail: 'No Image Uploaded!' });
							} else { // If Image are Uploaded
								/* ↓ CLOUDINARY FUNCTION ↓ */

								const cloudinary = require('cloudinary').v2 // Import Cloudinary Modules
								cloudinary.config({ // Setup Connection to Cloudinary API
									cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
									api_key: process.env.CLOUDINARY_API_KEY,
									api_secret: process.env.CLOUDINARY_API_SECRET
								});

								const path = req.file.path // Get File Path
								const uniqueFilename = new Date().toISOString() // Generate Unique File Name and then Convert to ISO String

								cloudinary.uploader.upload( // Upload File to Cloudinary
									path,
									{ public_id: `product/${uniqueFilename}`, tags: `user_image` }, // Send to 'user_pp' Folder & Tags set to 'user_image'
									function (err, image) {
										if (err) {
											res.json({ error: true, detail: err });
										} else {
											// Remove file from Server
											const fs = require('fs')
											fs.unlinkSync(path)

											connection.query( // Record the File Name at Database
												`UPDATE tb_user SET img_user=? WHERE id_user=?`,
												[image.url, id_user],
												function (err) {
													if (err) {
														res.json({ error: true, detail: err });
													} else {
														res.json({
															uploaded: true,
															message: 'Upload Successfuly',
															link: image.url
														});
													}
												}
											)
										}
									}
								)
							}
						}
					});
				}
			}
		}	
	)
}