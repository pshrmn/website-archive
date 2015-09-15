var express = require("express");
var http = require("http");
var socket = require("socket.io");
var routes = require("./server/routes");
var gamemaster = require("./server/utils/gamemaster");
var nunjucks = require("nunjucks");

var app = express();
var server = http.Server(app);
var io = socket(server);

app.set("port", (process.env.PORT || 3000))

nunjucks.configure("views", {
  autoescape: true,
  express: app
});

app.get("/", routes.index);
app.use("/static", express.static(__dirname + "/public/"));
gamemaster(io);

server.listen(app.get("port"), function(){
  console.log("server started at", (new Date()));
  console.log("listening on *:", app.get("port"));
});