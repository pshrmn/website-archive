var GameBoard = React.createClass({
  sendGame: function(event){
    var game = event.target.value;
    this.props.onMsg("set game", {
      game: game
    });
  },
  _gameSetup: function() {
    var gameName = this.props.currentGame;
    var html;
    if ( this.props.isOwner ) {
      var choices = this.props.gameChoices.map(function(choice, index){
        return (
          <label key={index}>
            {choice}
            <input type="radio"
                   name="game"
                   checked={choice === gameName}
                   value={choice}
                   onChange={this.sendGame} />
          </label>
        );
      }, this);

      html = (
        <div>
          <p>Select the game to play:</p>
          {choices}
        </div>
      );
    } else {
      html = "Playing: " + gameName;
    }
    return this.props.playing ? "" : (
      <div className="gameSetup">
        {html}
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
      case "Four":
        return (
          <Four onMsg={this.props.onMsg}
                {...this.props.game} />
        );
      default:
        return "";
      }
    }
    return "";
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
          <TTCCell key={key}
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

var TTCCell = React.createClass({
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


/*
 * Four
 */

var Four = React.createClass({
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
        <FourColumn key={i}
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

var FourColumn = React.createClass({
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
        <FourPiece key={i}
                   value={p} />
      );
    });
    return (
      <div className="column"
           onClick={this.tryPlace} >
        {pieces}
      </div>
    )
  }
});

var FourPiece = React.createClass({
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

/*
 * End Four
 */