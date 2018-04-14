var express = require('express');
var app = express();
//var http = require('http').Server(app);
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var server = app.listen(port);

var io = require('socket.io').listen(server);

var router = express.Router();

io.on('connection', function(socket){
	//console.log('user 1 is connected');

	socket.on('checkinObj', function(checkin){

		var mysql = require('mysql');

		var con = mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "",
			database: "facekathon"
		});

		con.connect(function(err){

		if(err) throw err;
			console.log("Connected")
			var sql = "INSERT INTO users(username, status, timestamp) VALUES (" + checkin[0].data.username + "," + checkin[0].status + "," + checkin[0].timestamp + ")";

			con.query(sql, function(err, result){
				if (err) throw err;
				console.log("1 record");
			});
		});
		console.log('out liao: '  + checkin[0].status);
	});
});