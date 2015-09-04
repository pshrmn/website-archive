import React from "react";

// Card
export default React.createClass({
  render: function() {

    var view = this.props.hidden ? 
      (
        <Front value={this.props.value}
               suit={this.props.suit} />
      ) : (
        <Back />
      );
    return (
      <div className="card">
        {view}
      </div>
    );
  }
});

var Front = React.createClass({
  render: function() {
    return (
      <div>{this.props.value} of {this.props.suit}</div>
    );
  }
});

var Back = React.createClass({
  render: function() {
    return (
      <div></div>
    );
  }
});
