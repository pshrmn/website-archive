var PlayableGames = [
  {
    name: "Tic Tac Toe",
    game: TicTacToe
  }
];

var GameBoard = React.createClass({
  getInitialState: function() {
    return {
      choices: this.props.choices
    };
  },
  _gameSetup: function() {
    return this.props.playing ? "" : (
      <div className="gameSetup">
      </div>
    );
  },
  _gameComponent: function() {
    if ( this.props.game ) {
      switch ( this.props.game.name ) {
      case "Tic Tac Toe":
        return (
          <TicTacToe onMsg={this.props.onMsg}
                     {...this.props.game} />
        );
      default:
        return "";
      }
    } else {
      return "";
    }
  },
  render: function() {
    /*
    game
    playing
    choices
    */
    var setup = this.props.playing ? "" : this._gameSetup();
    var game = this._gameComponent();
    return (
      <div className="gameBoard">
        {setup}
        {game}
      </div>
    );
  }
});

/*
 * Tic Tac Toe
 */
var TicTacToe = React.createClass({
  sendPosition: function(row, column) {
    this.props.onMsg("gameState", {
      row: row,
      column: column
    });
  },
  render: function() {
    var sendPosition = this.sendPosition;
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
                mark={sendPosition} />
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
  onClick: function(event){
    // don't send to server when the cell is already marked
    if ( this.props.value !== "" || !this.props.active ) {
      return;
    }
    this.props.mark(this.props.row, this.props.column);
  },
  render: function() {
    return (
      <td onClick={this.onClick}>
        {this.props.value}
      </td>
    );
  }
});
/*
 * End Tic Tac Toe
 */
