'use strict'

// Import MySQL Modules
const mysql = require('mysql');

// Create Connection
const connectSQL = mysql.createConnection({
	host: 'remotemysql.com',
	user: 'a2JUWyZwY9',
	password: '6q1FkkdpSB',
	database: 'a2JUWyZwY9'
});

// Check Database is Connect or Not
connectSQL.connect(function(err){
	if (err) {
		console.log(err);
	}else{
		console.log('Database Connected Successfuly');
	}
});

module.exports = connectSQL;