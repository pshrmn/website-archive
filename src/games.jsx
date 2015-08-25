var PlayableGames = [
  {
    name: "Tic Tac Toe",
    game: TicTacToe
  }
];

/*
 * Tic Tac Toe
 */
var TicTacToe = React.createClass({
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
          <Cell key={key}
                active={active}
                value={cell}
                row={rowIndex}
                column={colIndex}
                mark={sendState} />
        );
      });

      return (
        <tr key={rowIndex}>
          {cells}
        </tr>
      );
    });
    var player = this.props.active ? (
        <p>Current Player: {this.props.nextPlayer}</p>
      ) : "";
    return (
      <div className="tictactoe">
        <p>{this.props.msg}</p>
        {player}
        <table className="board" cellSpacing="0">
          {rows}
        </table>
      </div>
    );
  }
});

var Cell = React.createClass({
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
      <td onClick={this.sendState}>
        {this.props.value}
      </td>
    );
  }
});
/*
 * End Tic Tac Toe
 */
