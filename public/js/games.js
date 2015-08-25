var PlayableGames = [
  {
    name: "Tic Tac Toe",
    game: TicTacToe
  }
];

/*
 * Tic Tac Toe
 */
var TicTacToe = React.createClass({displayName: "TicTacToe",
  sendState: function(row, column) {
    this.props.onMsg("gameState", {
      row: row,
      column: column
    });
  },
  render: function() {
    var sendState = this.sendState;
    var active = this.props.active;
    var rows = this.props.board.map(function(row, rowIndex){
      var cells = row.map(function(cell, colIndex){
        var key = rowIndex + "," + colIndex;
        return (
          React.createElement(Cell, {key: key, 
                active: active, 
                value: cell, 
                row: rowIndex, 
                column: colIndex, 
                mark: sendState})
        );
      });

      return (
        React.createElement("tr", {key: rowIndex}, 
          cells
        )
      );
    });
    var player = this.props.active ? (
        React.createElement("p", null, "Current Player: ", this.props.nextPlayer)
      ) : "";
    return (
      React.createElement("div", {className: "tictactoe"}, 
        React.createElement("p", null, this.props.msg), 
        player, 
        React.createElement("table", {className: "board", cellSpacing: "0"}, 
          rows
        )
      )
    );
  }
});

var Cell = React.createClass({displayName: "Cell",
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.value !== this.props.value;
  },
  sendState: function(event){
    // don't send to server when the cell is already marked
    if ( this.props.value !== "" || !this.props.active ) {
      return;
    }
    this.props.mark(this.props.row, this.props.column);
  },
  render: function() {
    return (
      React.createElement("td", {onClick: this.sendState}, 
        this.props.value
      )
    );
  }
});
/*
 * End Tic Tac Toe
 */
