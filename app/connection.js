
/*
// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://127.0.0.1:27017/exampleDb", function(err, db) {
  if(!err) {
    console.log("We are connected");
  }else{
  	    console.log("We are not connected");
  }
});*/

var mysql = require("mysql");

// First you need to create a connection to the db
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "demo"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db'+err);
    return;
  }
  console.log('Connection established');
});

module.exports = con;