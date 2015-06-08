// requires d3, topojson, and queue
queue()
  .defer(d3.json, '/static/data/lower48.json')
  .defer(d3.csv, 'static/data/cities.csv')
  .await(function(error, states, cities){
    // size vars
    var width = 600;
    var height = 400;
    var scale = 700;
    var fromCity = 0;
    var toCity = 1;


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
    
    // do this before the cityGroup is created so that the cities will be drawn
    // over the trip lines
    var tripGroup = svg.append('g')
      .classed('trips', true);

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
          'active': function(d, i){
            return i === fromCity || i === toCity;
          }
        })
        .attr('r', 5)
        .attr('transform', function(d){
          return 'translate(' + d.x + ',' + d.y + ')';
        })
        .on('click', function(d, i){
          if ( first ) {
            fromCity = i;
            clearTrip();
            previewTrips(i);
          } else {
            toCity = i;
            clearPreviews();
            drawTrip();
          }
          this.classList.add('active');
          first = !first;
        });
    cityMarkers.append('svg:title')
      .text(function(d){
          return d.city;
        });

    var tripText = svg.append('text')
      .classed({
        'trip-text': true
      })
      .attr('x', width / 2 )
      .attr('y', height - 25)

    function clearTrip(){
      tripGroup.selectAll('line.trip').remove();
      tripText.text('');
      d3.selectAll('.city.active').classed('active', false);
    }

    function clearPreviews(){
      tripGroup.selectAll('line.preview').remove();
    }

    function previewTrips(index){

      tripText.text(cities[index].city + ' to ________ is ____ miles');
      var previews = cities.map(function(city){
          return [cities[index], city]
        })
        .filter(function(prev, i){
          return i !== index;
        });

      tripGroup.selectAll('line.preview')
          .data(previews)
        .enter().append('line')
          .classed({
            'preview': true
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

    function drawTrip(){
      var locs = [cities[fromCity], cities[toCity]];
      var miles = haversine(locs[0], locs[1]);
      tripText.text(locs[0].city + ' to ' + locs[1].city + ' is ' + miles + ' miles.');
      
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

    drawTrip();
  });
