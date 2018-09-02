//use the express backend to handle routes and server requests
const express = require("express");
//initialize the express app
const app = express();
//import path from node
const path = require("path");
//import the file system module
const fs = require("fs");
//import the csv module
const parse = require("csv-parse");

//static app dir
const APP_DIR = "/app/";
//loading all the csv modules from res directory
const RES_DIR = "/res/";
let files = [];

//LIST OF ALL HOTELS
let hotels = [];

//set the templating engine
app.set("view engine", "ejs");

//set the static files folder
app.use(express.static("public"));

//read all the csv files from the RES_DIR
fs.readdirSync(path.join(__dirname, RES_DIR)).forEach(file => {
  //check if the file is a csv file
  let filename = file.split(".");
  filename[filename.length - 1] === "csv" && files.push(file);
});

//reading all the available csv files
//Create a Parser
let parser = parse({ delimiter: ";" }, function(err, data) {
  data.forEach(function(line) {
    // create hotel Objects
    let hotel = {
      name: line[0],
      price: line[1]
    };
    hotels.push(hotel);
  });
});

//Getting all the desired values
files.forEach(file => {
  // read the inputFile, feed the contents to the parser
  fs.createReadStream(path.join(__dirname, RES_DIR, file)).pipe(parser);
});

//handling the base request route
app.get("/", (req, res) => {
  //redirect all the base requests to index file
  res.render("index", { data: hotels });
  console.log(hotels);
});

//listening to the web server at port 3000
app.listen(3000);
console.log("Running at Port 3000!");
