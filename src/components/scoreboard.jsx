import React from 'react';

import Person from './person';

const ScoreBoard = React.createClass({
  _spectatorsHTML: function() {
    var spectators = this.props.spectators.map(function(person, index){
      var you = person.name === this.props.you.name;
      return (
        <Person key={index}
                you={you}
                {...person} />
      );
    }, this);
    return (
      <div className="spectators">
        <p>Spectators ({this.props.spectators.length})</p>
        <ul>
          {spectators}
        </ul>
      </div>
    );
  },
  _playersHTML: function() {
    var players = this.props.players.map(function(person, index){
      var you = person.name === this.props.you.name;
      return (
        <Person key={index}
                you={you}
                {...person} />
      );
    }, this);
    return (
      <div className="players">
        <p>Players ({this.props.players.length})</p>
        <ul>
          {players}
        </ul>
      </div>
    );
  },
  render: function() {
    var spectators = this._spectatorsHTML();
    var players = this._playersHTML();
    return (
      <div className="scoreboard">
        {spectators}
        {players}
      </div>
    );
  }
});

export default ScoreBoard;