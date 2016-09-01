require("babel-register");

var express = require("express");
var http = require("http");

var roomkeeper = require("./src/server/utils/roomkeeper").default;
const handleRender = require("./src/server/renderer").default;

var app = express();
var server = http.Server(app);

app.set("port", (process.env.PORT || 8000))

app.use("/static", express.static(__dirname + "/public/"));
app.get("/", handleRender);
app.get("*", handleRender);

roomkeeper(server);

server.listen(app.get("port"), function(){
  console.log("server started at", (new Date()));
  console.log("listening on *:", app.get("port"));
});