var express = require("express");
var app = express();
var path = require("path");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "10.49.80.3",
  user: "root",
  password: "root",
  database: "products"
});

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/search", function(req, res) {
  res.send("Hello there!");
});

app.get("/search/:query", function(req, res) {
  const query = req.params.query;
  const payload = [];

  // Do logic to get data
  // SQL database connection
  connection.query(
    `SELECT name FROM products where name LIKE '%${query}%' LIMIT 10`,
    function(error, results, fields) {
      if (error) {
        console.log(error);
      }

      if (results && results.isArray && results.isArray()) {
        for (const product of results) {
          payload.push(product.name);
        }
        res.json(payload);
      } else {
        res.json([]);
      }
    }
  );
});

app.listen(process.env.PORT ? process.env.PORT : 8080);