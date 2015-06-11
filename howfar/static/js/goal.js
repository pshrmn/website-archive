function drawGoal(startCity, endCity, percent, distance){
  queue()
    .defer(d3.json, '/static/data/lower48.json')
    .await(function(error, states){
      var width = 600;
      var height = 400;
      var scale = 700;
      var svg = d3.select('.map').append('svg')
        .attr('width', width)
        .attr('height', height);
      var g = svg.append('g');
      var projection = d3.geo.albersUsa()
        .scale(scale)
        .translate([width / 2, height / 2]);

      var path = d3.geo.path()
        .projection(projection);

      drawMap(g, states, path);

      // draw cities
      var cities = [startCity, endCity];
      cities.forEach(function(city){
          var coords = projection([city.longitude, city.latitude]);
          city.x = coords[0];
          city.y = coords[1];
      });
      var perc = d3.interpolateObject(startCity, endCity)(percent);
      

      var citiesGroup = g.append('g')
        .classed('cities-group', true);

      var cityMarkers = citiesGroup.selectAll('circle.city')
          .data(cities)
        .enter().append('circle')
          .classed({
            'city': true,
            'start': function(d, i){
              return i === 0;
            },
            'end': function(d, i){
              return i === 1;
            }
          })
          .attr('r', 3)
          .attr('transform', function(d){
            return 'translate(' + d.x + ',' + d.y + ')';
          })

      var tripGroup = g.append('g')
        .classed('trip-group', true);

      // draw current progress
      tripGroup.append('line')
        .classed({
          'goal': true
        })
        .attr('x1', startCity.x)
        .attr('y1', startCity.y)
        .attr('x2', endCity.x)
        .attr('y2', endCity.y);

      tripGroup.append('line')
        .classed({
          'progress': true
        })
        .attr('x1', startCity.x)
        .attr('y1', startCity.y)
        .attr('x2', perc.x)
        .attr('y2', perc.y);

      var halfway = d3.interpolateObject(startCity, endCity)(0.5);
      // center the svg between the cities
      var k = optimalScale(startCity, endCity, width, height);
      var x = halfway.x;
      var y = halfway.y;
      if ( k > 2 ) {
        /*
         * transition is applied right to left
         * first move the desired center point to (0, 0)
         * then scale the map by the desired amount
         * the translate the center point to the center of the svg
         */
        g
          .classed({
            'zoomed': true
          })
          .attr('transform', 'translate(' + (width / 2)+ ',' + (height / 2) + ')' +
                            'scale(' + k + ')' +
                            'translate(' + -x + ',' + -y + ')');
      }

    });
}

// figure out the max scale in each direction that would allow for the cities
// to be drawn with some padding and fit within the svg. return the lower scale
function optimalScale(startCity, endCity, width, height){
  var widthScale = width / (Math.abs(startCity.x - endCity.x) + 50);
  var heightScale = height / (Math.abs(startCity.y - endCity.y) + 50);
  return d3.min([widthScale, heightScale]);
}
