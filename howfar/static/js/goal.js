function showProgress(goalDistance, currentDistances){
  var progress = currentDistances.reduce(function(prev, curr){
    return prev + curr;
  }, 0);
  // convert to out of 100 right away
  var percent = (progress / goalDistance)*100;
  var left = goalDistance - progress;
  var success = percent >= 100;
  var holder = d3.select('.progress')

  // display progress text
  var text = holder.append('p')
    .text(progress + '/' + goalDistance + ' miles (' + percent.toFixed(2) + '%)')

  // display progress bar
  var holderBar = holder.append('div')
    .attr('id', 'progress-bar')
    .attr('title', function(){
      return success ? 'congratulations on finishing your goal' :
        left + ' miles to go!';
    });

  var totalBar = holderBar.append('div')
    .classed({
      'bar': true,
      'total': true
    });

  var progressBar = holderBar.append('div')
    .classed({
      'bar': true,
      'current': true
    })
    .style('width', d3.min([percent, 100]) + '%');
}

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
      var halfway = d3.interpolateObject(startCity, endCity)(0.5);
      // center the svg between the cities
      var k = d3.min([3000/distance, 10]);
      var x = halfway.x;
      var y = halfway.y;
      g.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")

      var citiesGroup = g.append('g')
        .classed('cities-group', true);

      citiesGroup.selectAll('circle.city')
          .data(cities)
        .enter().append('circle')
          .classed({
            'city': true
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
    });
}
