function drawMap(svg, states, path){

  var features = topojson.feature(states, states.objects.states).features;

  var states = svg.append('g')
    .classed('country', true)
    .selectAll('g.state')
      .data(features)
    .enter().append('g')
      .classed('state', true)
      .append('path')
          .classed('outline', true)
          .attr('d', path);
}

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
  return Math.round(R*c, 10);
}

function toRads(num){
  return num * Math.PI / 180;
}
