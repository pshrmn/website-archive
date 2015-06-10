
function drawCities(cities){
  // requires d3, topojson, and queue
  queue()
    .defer(d3.json, '/static/data/lower48.json')
    .await(function(error, states){
      // size vars
      var width = 600;
      var height = 400;
      var scale = 700;
      var fromCity = undefined;
      var toCity = undefined;


      d3.select('#id_start')
        .on('change', function(d){
          if ( this.value === '' ) {
            fromCity = undefined;
          } else {
            fromCity = parseInt(this.value, 10) - 1;
          }
          connectCities();
        });

      d3.select('#id_end')
        .on('change', function(d){
          if ( this.value === '' ) {
            toCity = undefined;
          } else {
            toCity = parseInt(this.value, 10) - 1;
          }
          connectCities();
        });

      var holder = d3.select('.map');
      var svg = holder.append('svg')
        .attr('width', width)
        .attr('height', height);

      var projection = d3.geo.albersUsa()
        .scale(scale)
        .translate([width / 2, height / 2]);

      var path = d3.geo.path()
        .projection(projection);

      drawMap(svg, states, path);
      

      // pre-calculate the locations in the svg
      cities.forEach(function(city){
        city.latitude = parseFloat(city.latitude);
        city.longitude = parseFloat(city.longitude);
        var coords = projection([city.longitude, city.latitude]);
        city.x = coords[0];
        city.y = coords[1];
      });

      var first = true;

      // draw the cities
      var cityGroup = svg.append('g')
        .classed({
          'cities': true
        });

      var cityMarkers = cityGroup.selectAll('circle.city')
          .data(cities)
        .enter().append('circle')
          .classed({
            'city': true,
          })
          .attr('r', 5)
          .attr('transform', function(d){
            return 'translate(' + d.x + ',' + d.y + ')';
          });

      cityMarkers.append('svg:title')
        .text(function(d){
            return d.name;
          });

      var tripText = svg.append('text')
        .classed({
          'trip-text': true
        })
        .attr('x', width / 2 )
        .attr('y', height - 25)

      var tripGroup = svg.append('g')
        .classed('trips', true);

      function clearTrip(){
        tripGroup.selectAll('line.trip').remove();
        tripText.text('');
        d3.selectAll('.city.active').classed('active', false);
      }

      function connectCities(){
        clearTrip();
        cityMarkers.classed({
          'active': function(d, i){
            return i === fromCity || i === toCity;
          }
        })
        if ( fromCity === undefined || toCity === undefined || fromCity === toCity ) {
          return;
        }
        var locs = [cities[fromCity], cities[toCity]];
        var miles = haversine(locs[0], locs[1]);
        tripText.text(locs[0].name + ' to ' + locs[1].name + ' is ' + miles + ' miles.');
        
        var trip = tripGroup.append('line')
            .datum(locs)
            .classed({
              'trip': true
            })
            .attr('x1', function(d){
              return d[0].x;
            })
            .attr('x2', function(d){
              return d[1].x;
            })
            .attr('y1', function(d){
              return d[0].y;
            })
            .attr('y2', function(d){
              return d[1].y;
            });
      }

      connectCities();
    });
}