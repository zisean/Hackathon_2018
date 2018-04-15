var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "facekathon"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE users (username VARCHAR(255), status VARCHAR(8), timestamp VARCHAR(255), image_name VARCHAR(255), type VARCHAR(10))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});