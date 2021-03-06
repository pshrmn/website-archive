function orbit(primary, satellites, options) {
  options = options || {};
  var holder = options.holder || document.body;
  var radius = options.radius || 250;
  var hasScale = options.hasScale === undefined ? true : options.hasScale;
  var minPeriod = 0;
  var maxPeriod = options.maxPeriod || 2500;
  var period = options.period || (minPeriod + maxPeriod) / 2;
  var hasArcs = options.hasArcs === undefined ? true: options.hasArcs;

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
    p.currentAngle = 0;
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

  // controls
  var controls = d3.select(holder).append('div')
    .classed({'controls': true});
  if ( hasScale ) {
    var periodControls = controls.append('label')
      .text('Time Scale');
    var periodScale = controls.append('p')
      .text(periodHours(period) + ' hours per second');
    periodControls.append('input')
        .attr('type', 'range')
        .attr('min', minPeriod)
        .attr('max', maxPeriod)
        .attr('step', 50)
        .attr('value', period)
        .on('change', function() {
          period = d3.event.target.value;
          periodScale.text(periodHours(period) + ' hours per second');
          start = null;
          satellites.forEach(function(p) {
            p.offsetAngle = p.currentAngle;
          })
        });
    
  }

  // the animation callback
  var start = null;
  return function step(timestamp) {
    if ( start === null ) {
      start = timestamp;
    }
    var diff = timestamp - start;
    satellitesEles
      .attr("transform", function(d, i) {
        var angle = offsetAngle(diff * period, d);
        d.currentAngle = angle;
        return "rotate(" + angle + ")translate(0, " + (-offsetScale(d,i)) + ")";
      });

    window.requestAnimationFrame(step);
  }
}

/*
 * compute the current angle that the satellite should be at as a
 * product of the number of seconds in an orbital period, the seconds
 * that have elapsed, and the starting offset angle
 *
 * 1000 * period is the time scale
 * i.e. if the period is 600, for every real world second that
 * elapses, 600,000 seconds (167 hours or ~7 Earth days) elapses.
 * For the Earth, that means that a full rotation would take ~52 seconds
 */
function offsetAngle(time, satellite) {
  var secondsInAYear = Math.abs(satellite.day_length * satellite.orbit);
  // percent as decimal [0,1)
  var percent = (time / secondsInAYear) % 1;
  return satellite.offsetAngle - (360*percent);
}

function periodHours(period) {
  return Math.round((period * 1000) / 3600);
}

function makeSVG(holder, radius) {
  var parent = d3.select(holder);
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
