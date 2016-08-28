import React from 'react';

const Person = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return (nextProps.name !== this.props.name ||
      nextProps.owner !== this.props.owner ||
      nextProps.ready !== this.props.ready );
  },
  _userSymbols: function() {
    var owner = this.props.owner ? (
      <span title="owner">{String.fromCharCode(9818)}</span>
    ) : "";
    return (
      <div className="symbols">
      {owner}
      </div>
    );
  },
  render: function() {
    var readyClass = this.props.ready ? "ready green" : "ready gray";
    var symbols = this._userSymbols();
    var youClass = this.props.you ? "person you" : "person";
    return (
      <li className={youClass}>
        <div className={readyClass}></div>
        {this.props.name}
        {symbols} ({this.props.wins}-{this.props.losses})
      </li>
    );
  }
});

export default Person;
