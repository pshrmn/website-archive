function orbit(primary, satellites, options) {
  options = options || {};
  var holder = options.holder || document.body;
  var radius = options.radius || 250;
  var period = options.period || 1000;
  var hasArcs = options.hasArcs || true;

  var furthest = d3.max(satellites, function(d) { return d.distance; });
  /*
  the range on the scale is offset to prevent:
  1. the outermost satellite from extending beyond the svg
  2. the innermost satellites from overlapping the primary
  */
  var fitScale = d3.scale.linear()
    .range([5, radius-10])
    .domain([0, furthest])

  satellites.forEach(function(p, i) {
    // normalize the distance to the size of the svg
    // cache since this is looked up every frame
    p.normDistance = fitScale(p.distance);
    p.offsetAngle = 0;
  });

  var offsetScale = function(d, i) {
    return d.normDistance;
  }

  var svg = makeSVG(holder, radius);
  drawSpace(svg, radius)
  if ( hasArcs ) {
    drawArcs(svg, satellites, offsetScale);
  }
  drawPrimary(svg, primary);
  var satellitesEles = initSatellites(svg, satellites, offsetScale);

  // the animation callback
  var start = null;
  return function step(timestamp) {
    if ( start === null ) {
      start = timestamp;
    }
    var diff = timestamp - start;

    satellitesEles
      .attr("transform", function(d, i) {
        var seconds_in_a_year = Math.abs(d.day_length * d.orbit);
        var percent = (diff*period / seconds_in_a_year) % 1;
        var angle = d.offsetAngle - (360*percent);
        return "rotate(" + angle + ")translate(0, " + (-offsetScale(d,i)) + ")";
      });

    window.requestAnimationFrame(step);
  }
}

function makeSVG(holder, radius) {
  var parent = d3.select(holder)
  var svg = parent.append('svg')
    .attr('width', radius*2)
    .attr('height', radius*2)
    .append('g')
      .attr('transform', 'translate(' + radius + ',' + radius + ')');
  return svg;
}

function drawSpace(svg, radius) {
  var space = svg.append('circle')
    .classed({'space': true})
    .attr('r', radius);
  return space;
}

function drawArcs(svg, satellites, scale) {
  // create the arcs which depict the orbital path of the planets
  var arcs = svg.append("g")
      .classed("arcs", true)
    .selectAll("circle.arc")
      .data(satellites)
    .enter().append("circle")
      .classed("arc", true)
      .attr("r", scale);
}

function drawPrimary(svg, primary) {
  if ( primary === undefined || primary === null ) {
    return null;
  }
  var element = svg.append("circle")
    .classed("primary", true)
    .attr("r", 4)
    .style("fill", primary.color || "#FFC107")
  return element;
}

function initSatellites(svg, satellites, scale) {
  // create the satellites
  var satelliteGroups = svg.append("g")
      .classed("satellites", true)
    .selectAll("g.planet")
      .data(satellites)
    .enter().append("g")
      .classed("satellite", true)
      .attr("transform", function(d, i) {
        return "rotate(" + d.offsetAngle + ")translate(0, " + (-scale(d,i)) + ")";
      });

  satelliteGroups.append("circle")
    .attr("r", 2)
    .style("fill", function(d) { return d.color || "#2196F3"; });

  satelliteGroups.append("title")
    .text(function(d) {
      return d.name;
    });

  return satelliteGroups;
}
