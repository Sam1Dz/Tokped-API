'use strict'

// Import Modules & Database Connection
require('dotenv').config();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const connection = require('../connect');

// Initialize Sender Email
const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.SENDER_EMAIL,
		pass: process.env.SENDER_PASS
	}
});

/* ↓ MIDDLEWARE FUNCTION ↓ */

// Test API Function
exports.test = function (req, res) {
	res.json({
		error: false,
		message: 'Register API Connect Successfuly'
	});
}

// Send data register to Database & Send 6 digit random code via Email
exports.create = function (req, res) {
	// Initialize input from Body
	let email = req.body.email;
	
	const digit = Math.floor(100000 + Math.random() * 900000); // 6 Digit Random Generator
	
	// Initialize Receiver Email
	const mailOptions = {
		from: process.env.SENDER_EMAIL,
		to: email,
		subject: '6 Digit kode rahasia untuk melanjutkan Registrasi',
		html: 'JANGAN MEMBERITAHUKAN KODE RAHASIA INI KE SIAPAPUN termasuk pihak Tokopedia.<br>WASPADA TERHADAP KASUS PENIPUAN! KODE RAHASIA untuk melanjutkan Registrasi: <b><i>' + digit + '</i></b>'
	}

	if (email === '') {
		res.json({
			error: true,
			message: 'Alamat Email harus di Isi'
		});
	}else {
		connection.query(
			`SELECT COUNT(email) AS total FROM tb_user WHERE email=?`,
			[email],
			function (err, rows) {
				if (err) {
					res.json({
						error: true,
						message: err
					});
				}else{
					let total = Math.ceil(rows[0].total);
					if (total === 1) { // If Email already exists
						res.json({
							message: 'Email Sudah Terdaftar'
						});
					}else{ // If Not exists
						// Send Email & Insert Email + 6 Digit code on Database 
						transporter.sendMail(mailOptions, function(err, info){
							if (err) {
								res.json({
									error: true,
									message: err
								});
							}else{
								connection.query(
									`INSERT INTO tb_user SET email=?, password=?, full_name='', address='', img_user=''`,
									[email, digit],
									function (err) {
										if (err) {
											res.json({
												error: true,
												message: err
											});
										}else{
											res.json({
												error: false,
												message: 'Akun berhasil dibuat'
											});
										}
									}
								)
							}
						});
					}
				}
			}
		)
	}
}