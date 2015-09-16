import React from "react";

export default React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return this.props.id !== nextProps.id;
  },
  /*
   * determine where the piece will be placed, and after placing, check if
   * the game has been won
   */
  placePiece: function(column) {
    this.props.onMsg("gameState", {
      column: column
    });
  },
  _makeColumns: function() {
    return this.props.board.map(function(c, i){
      return (
        <Column key={i}
                    pieces={c}
                    index={i}
                    onPlace={this.placePiece} />
      );
    }, this);
  },
  render: function() {
    var player = this.props.active ? (
      <p>Current Player: {this.props.nextPlayer}</p>
    ) : "";
    return (
      <div className="four">
        <div className="game-message">
          {this.props.msg}
        </div>
        {player}
        <div className="board">
          <div className="leg left"></div>
          {this._makeColumns()}
          <div className="leg right"></div>
          <div className="slider"></div>
        </div>
      </div>
    );
  }
});

var Column = React.createClass({
  tryPlace: function(event) {
    if ( this._canPlace() ) {
      this.setState({
        preview: undefined
      });
      this.props.onPlace(this.props.index);
    }
  },
  _canPlace: function() {
    // filled from the bottom up, so first spot is last filled
    return this.props.pieces[0] === "";
  },
  render: function() {
    var pieces = this.props.pieces.map(function(p, i){
      return (
        <Piece key={i}
                   value={p} />
      );
    });
    return (
      <div className="column"
           onClick={this.tryPlace} >
        {pieces}
      </div>
    );
  }
});

var Piece = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return (nextProps.value !== this.props.value);
  },
  render: function() {
    var className = this.props.value === "" ? "none" : this.props.value;
    var pieceClasses = ["piece", className];
    var spaceClasses = ["space"];
    var pieceClassName = pieceClasses.join(" ");
    var spaceClassName = spaceClasses.join(" ");
    return (
      <div className={spaceClassName}>
        <div className={pieceClassName}></div>
      </div>
    );
  }
});
