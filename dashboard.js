var express = require('express');
var app = express();
//var http = require('http').Server(app);
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

var port = process.env.PORT || 8080;

var server = app.listen(port);

var io = require('socket.io').listen(server);

var router = express.Router();

const fs = require("fs");

app.use(express.static('storage'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

// http.listen(3000, function(){
// 	console.log('listen on *:3000');
// });

router.get('/', function(req, res){

	res.json({ message: 'Hi API'});
});

app.post('/getData', function(req, res){
	var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'facekathon'
});

connection.connect();

connection.query('SELECT * FROM users', function (error, results, fields) {
  if (error) throw error;

  for (var i = 0; i < results.length; i++) {
  	console.log('username: ', results[i].username);
  	console.log('status: ', results[i].status);
  	console.log('timestamp: ', results[i].timestamp);
  }

  	res.send(results);

  
});

connection.end();
	// var obj = {};
	// console.log('body: ' + JSON.stringify(req.body));
});

// Post from client
router.post('/checkin', function(req, res){

	var socket = io;

  	var mysql = require('mysql');

	var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		database: "facekathon"
	});

	fs.writeFile('./storage/images/' + req.body.timestamp + '.png', req.body.data.image, 'base64',
  				function(err){
  					if(err) {
  						console.log(err);
  						res.send(err);

  					}

  			});

  	if(req.body.status === "FAIL"){

  			con.connect(function(err){

			if(err) throw err;
				console.log("Connected")
				var sql = "INSERT INTO users (username, status, timestamp, image_name, type) VALUES ('-" 
				+ "','" + req.body.status + "','" + req.body.timestamp + "','" +  req.body.timestamp + "', 'Clock-in')";

				con.query(sql, function(err, result){
					if (err) throw err;
					console.log("1 record");
				});
			});
  	}else{

		con.connect(function(err){

		if(err) throw err;
			console.log("Connected")
			var sql = `INSERT INTO users (username, status, timestamp, image_name, type) VALUES (
			'${req.body.data.username}', 
			'${req.body.status}', 
			'${req.body.timestamp}', 
			'${req.body.timestamp}', 
			'Clock-in')`;

			con.query(sql, function(err, result){
				if (err) throw err;
				console.log("1 record");
			});
		});

		res.send('success');
  	}

  	req.body.type = 'Clock-in';
	
	socket.emit('checkinObj',req.body);
	
});

// // Testing
// router.get('/checkin', function(req, res){

// 	var socket = io;

// 	var checkin = { status: 'SUCCESS',
//   					data: { username: 'Edward' },
//   					timestamp: 1523701749091 };

//   //	io.on('connection', (socket) => {
//   		socket.emit('checkinObj',checkin);
// //});
  

// 	console.log(checkin);

// 	var mysql = require('mysql');

// 		var con = mysql.createConnection({
// 			host: "localhost",
// 			user: "root",
// 			password: "",
// 			database: "facekathon"
// 		});

// 		con.connect(function(err){

// 		if(err) throw err;
// 			console.log("Connected")
// 			var sql = "INSERT INTO users (username, status, timestamp, image_name) VALUES ('" 
// 			+ checkin.data.username + "','" + checkin.status + "','" + checkin.timestamp + "','" + "')";
// 			con.query(sql, function(err, result){
// 				if (err) throw err;
// 				console.log("1 record");
// 			});
// 		});

// 	res.send('success');


	
// });

router.post('/register', function(req, res){
	var mysql = require('mysql');

	var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		database: "facekathon"
	});
	res.send('register');
});


router.post('/checkout', function(req, res){

	var socket = io;

  	var mysql = require('mysql');

	var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		database: "facekathon"
	});

	fs.writeFile('./storage/images/' + req.body.timestamp + '.png', req.body.data.image, 'base64',
  				function(err){
  					if(err) {
  						console.log(err);
  						res.send(err);

  					}

  			});

  	if(req.body.status === "FAIL"){

  			con.connect(function(err){

			if(err) throw err;
				console.log("Connected")
				var sql = "INSERT INTO users (username, status, timestamp, image_name, type) VALUES ('-" 
				+ "','" + req.body.status + "','" + req.body.timestamp + "','" +  req.body.timestamp + "', 'Clock-in')";

				con.query(sql, function(err, result){
					if (err) throw err;
					console.log("1 record");
				});
			});
  	}else{

		con.connect(function(err){

		if(err) throw err;
			console.log("Connected")
			var sql = `INSERT INTO users (username, status, timestamp, image_name, type) VALUES (
			'${req.body.data.username}', 
			'${req.body.status}', 
			${req.body.timestamp}, 
			'${req.body.timestamp}', 
			'Clock-in')`;

			con.query(sql, function(err, result){
				if (err) throw err;
				console.log("1 record");
			});
		});

		res.send('success');
  	}

  	req.body.type = 'Clock-out';
	
	socket.emit('checkinObj',req.body);
});


app.use('/api', router);

//app.listen(port);
console.log('Start listening on port' + port);

