// requires d3, topojson, and queue

queue()
  .defer(d3.json, '/static/data/lower48.json')
  .await(function(error, states){
    // size vars
    var width = 600;
    var height = 400;
    var scale = 700;

    var svg = d3.select('.content').append("svg")
      .attr("width", width)
      .attr("height", height);

    var projection = d3.geo.albersUsa()
      .scale(scale)
      .translate([width / 2, height / 2]);

    var path = d3.geo.path()
      .projection(projection);

    var stateData = topojson.feature(states, states.objects.states).features;

    var states = svg.append("g")
      .classed("country", true)
      .selectAll("g.state")
        .data(stateData)
      .enter().append("g")
        .classed("state", true)
        .append("path")
            .classed("outline", true)
            .attr("d", path);
  });
