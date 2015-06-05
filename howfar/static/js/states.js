// requires d3, topojson, and queue

queue()
  .defer(d3.json, '/static/data/lower48.json')
  .defer(d3.csv, 'static/data/cities.csv')
  .await(function(error, states, cities){
    // size vars
    var width = 600;
    var height = 400;
    var scale = 700;

    var svg = d3.select('.content').append('svg')
      .attr('width', width)
      .attr('height', height);

    var projection = d3.geo.albersUsa()
      .scale(scale)
      .translate([width / 2, height / 2]);

    var path = d3.geo.path()
      .projection(projection);

    var stateData = topojson.feature(states, states.objects.states).features;

    var states = svg.append('g')
      .classed('country', true)
      .selectAll('g.state')
        .data(stateData)
      .enter().append('g')
        .classed('state', true)
        .append('path')
            .classed('outline', true)
            .attr('d', path);

    // pre-calculate the locations in the svg
    cities.forEach(function(city){
      city.latitude = parseFloat(city.latitude);
      city.longitude = parseFloat(city.longitude);
      var coords = projection([city.longitude, city.latitude]);
      city.x = coords[0];
      city.y = coords[1];
    });

    var diamond = d3.svg.symbol()
      .type('diamond');

    // draw the cities
    var cityGroup = svg.append('g')
      .classed({
        'cities': true
      });

    cityGroup.selectAll('path.city')
        .data(cities)
      .enter().append('path')
        .classed({
          'city': true
        })
        .attr('d', diamond)
        .attr('transform', function(d){
          return 'translate(' + d.x + ',' + d.y + ')';
        });

    var trips = svg.append('g')
      .classed({
        'trips': true
      });
    var tripText = svg.append('text')
      .classed({
        'trip-text': true
      })
      .attr('x', width / 2 )
      .attr('y', height - 25)

    var prettyNums = d3.format(",.02f");
    function drawTrip(){
      var locs = randomCities();
      var miles = prettyNums(haversine(locs[0], locs[1]));
      tripText.text(locs[0].city + ' to ' + locs[1].city + ' is ' + miles + ' miles.');
      var trip = trips.append('line')
          .datum(locs)
          .classed({
            'trip': true
          })
          .attr('x1', function(d){
            return d[0].x;
          })
          .attr('x2', function(d){
            return d[0].x;
          })
          .attr('y1', function(d){
            return d[0].y;
          })
          .attr('y2', function(d){
            return d[0].y;
          });

      // length of transition will vary based on the length of the trip
      var distance = Math.sqrt(Math.pow(locs[1].x - locs[0].x, 2) +
        Math.pow(locs[1].y - locs[0].y, 2));
      trip.transition()
        .duration(distance*4)
        .ease('linear')
        .attr('x2', function(d){
          return d[1].x;
        })
        .attr('y2', function(d){
          return d[1].y;
        })
    }

    // return two random (and different) cities from the cities array
    function randomCities(){
      var count = cities.length;
      var pos = Math.floor(Math.random()*count);
      var secondPos = pos
      while ( secondPos === pos ) {
        secondPos = Math.floor(Math.random()*count);
      }
      return [cities[pos], cities[secondPos]];
    }

    drawTrip();
  });

function haversine(start, end){
  var R = 3963.1676
  var start_lat = toRads(start.latitude);
  var start_cos = Math.cos(start_lat);

  var end_lat = toRads(end.latitude);
  var end_cos = Math.cos(end_lat)

  var lat_delta = toRads(end.latitude - start.latitude);
  var lat_delta_sin = Math.pow(Math.sin(lat_delta/2), 2)

  var long_delta = toRads(end.longitude - start.longitude);
  var long_delta_sin = Math.pow(Math.sin(long_delta/2), 2);

  var a = lat_delta_sin + (start_cos * end_cos * long_delta_sin)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R*c
}

function toRads(num){
  return num * Math.PI / 180;
}