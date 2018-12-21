require("dotenv").config();
var express = require("express");
var app = express();
var path = require("path");
var mysql = require("mysql");
const Knex = require("knex");

app.enable("trust proxy");

const knex = connect();

function connect() {
  // [START gae_flex_mysql_connect]
  const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
  };

  if (
    process.env.INSTANCE_CONNECTION_NAME &&
    process.env.NODE_ENV === "production"
  ) {
    config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
  } else {
    config.host = "35.226.183.47";
  }

  // Connect to the database
  const connection = Knex({
    client: "mysql",
    connection: config
  });
  // [END gae_flex_mysql_connect]

  return connection;
}

function searchProducts(query) {}

// searchProducts("call");

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/search", function(req, res) {
  res.send("Hello there!");
});

app.get("/search/:query", function(req, res) {
  const query = req.params.query;
  knex
    .select("*")
    .from("products")
    .where("name", "like", `%${query}%`)
    .limit(10)
    .then(results => {
      const map = results.map(product => product.name);
      res.send(map);
    })
    .catch(e => {
      console.log(e);
      res.send([]);
    });
});

app.listen(process.env.PORT || 8080);