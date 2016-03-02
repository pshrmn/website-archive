function distancePerPixel(planets, radius) {
  return radius / planets.reduce(function(max, curr) {
    return max > curr.distance ? max : curr.distance;  
  }, -Infinity);  
}

var radius = 250;
var height = radius * 2;
var width = radius * 2;
var innerRadius = radius - 25;
var planets = planetarySystemJSON.star.planets;
var pixelLength = distancePerPixel(planets, innerRadius);
var maxDistance = d3.max(planets, function(p) {
  return p.distance;
});
var minDistance = d3.min(planets, function(p) {
  return p.distance;
});

var logScale = d3.scale.log()
  .base(minDistance)
  .domain([1, maxDistance])
  .range([0, innerRadius]);

planets.forEach(function(p, i) {
  // normalize the distance to the size of the svg
  //p.normDistance = logScale(p.distance);
  p.normDistance = p.distance * pixelLength;
  // randomize the starting location
  p.offsetAngle = 0;//Math.floor(Math.random() * 360);
});

var offsetFunction = function(d, i) {
  return d.normDistance;
}
var system = d3.select("#system");

// create the SVG
var svg = system
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
      return "rotate(" + d.offsetAngle + ")translate(0, " + (-offsetFunction(d,i)) + ")";
    });

planetCircles.append("circle").attr("r", 2)

planetCircles.append("title")
  .text(function(d) {
    return d.name;
  });

// the animation callback
var start = null;
var period = 1000;
function step(timestamp) {
  if ( start === null ) {
    start = timestamp;
  }
  var diff = timestamp - start;

  planetCircles
    .attr("transform", function(d, i) {

      var seconds_in_a_year = Math.abs(d.day_length * d.orbit);
      var percent = (diff*period / seconds_in_a_year) % 1;
      

      var rotate = 360 * percent;
      return "rotate(" + (d.offsetAngle-rotate) + ")translate(0, " + (-offsetFunction(d,i)) + ")";
    });

  window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
