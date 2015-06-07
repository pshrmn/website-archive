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
    .style('width', percent + '%');
}