function distancePerPixel(planets, radius) {
  return radius / planets.reduce(function(max, curr) {
    return max > curr.distance ? max : curr.distance;  
  }, -Infinity);  
}

var radius = 250;
var height = radius * 2;
var width = radius * 2;
var innerRadius = radius - 25;
var planets = solarSystemJSON.star.planets;
var pixelLength = distancePerPixel(planets, innerRadius);
planets.forEach(function(p, i) {
  // normalize the distance to the size of the svg
  p.normDistance = p.distance * pixelLength;
});

var offsetFunction = function(d, i) {
  return d.normDistance;
}
var solarSystem = d3.select("#solar-system");

// create the SVG
var svg = solarSystem
  .append("svg")
    .attr("width", width)
    .attr("height", height);
var g = svg
  .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

// create the arcs which depict the orbital path of the planets
var arcs = g.append("g")
    .classed("arcs", true)
  .selectAll("circle.arc")
    .data(planets)
  .enter().append("circle")
    .classed("arc", true)
    .attr("r", offsetFunction);

// the starting line
var meridian = g.append("line")
  .classed("meridian", true)
  .attr("x1", 0)
  .attr("x2", 0)
  .attr("y1", 0)
  .attr("y2", -innerRadius);

var sun = g.append("circle")
  .classed("sun", true)
  .attr("r", 4);

// create the planets
var planetCircles = g.append("g")
    .classed("planets", true)
  .selectAll("g.planet")
    .data(planets)
  .enter().append("g")
    .classed("planet", true)
    .attr("transform", function(d, i) {
      return "translate(0, " + (-offsetFunction(d,i)) + ")";
    });

planetCircles.append("circle").attr("r", 3)

planetCircles.append("title")
  .text(function(d) {
    return d.name;
  });

// the animation callback
var start = null;
var period = 100;
function step(timestamp) {
  if ( start === null ) {
    start = timestamp;
  }
  var diff = timestamp - start;

  planetCircles
    .attr("transform", function(d, i) {
      var rotate = (360 * (diff / (period * d.orbit))) % 360;
      return "rotate(" + (-rotate) + ")translate(0, " + (-offsetFunction(d,i)) + ")";
    });

  window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
