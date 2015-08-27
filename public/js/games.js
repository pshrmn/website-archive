var PlayableGames = [
  "Tic Tac Toe"
];

var GameBoard = React.createClass({displayName: "GameBoard",
  getInitialState: function() {
    return {
      choices: this.props.choices,
      gameName: this.props.choices[0]
    };
  },
  sendGame: function(event){
    var game = event.target.value;
    this.props.onMsg("set game", game);
  },
  _gameSetup: function() {
    var gameName = this.state.gameName;
    var choices = this.state.choices.map(function(choice, index){
      return (
        React.createElement("label", {key: index}, 
          choice, 
          React.createElement("input", {type: "radio", 
                 name: "game", 
                 checked: choice === gameName, 
                 value: choice, 
                 onChange: this.sendGmae})
        )
      );
    });

    return this.props.playing ? "" : (
      React.createElement("div", {className: "gameSetup"}, 
        choices
      )
    );
  },
  _gameComponent: function() {
    if ( this.props.game ) {
      switch ( this.props.game.name ) {
      case "Tic Tac Toe":
        return (
          React.createElement(TicTacToe, React.__spread({onMsg: this.props.onMsg}, 
                     this.props.game))
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
      React.createElement("div", {className: "gameBoard"}, 
        setup, 
        game
      )
    );
  }
});

/*
 * Tic Tac Toe
 */
var TicTacToe = React.createClass({displayName: "TicTacToe",
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
          React.createElement(Cell, {key: key, 
                active: active, 
                value: cell, 
                row: rowIndex, 
                column: colIndex, 
                mark: sendPosition})
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
  onClick: function(event){
    // don't send to server when the cell is already marked
    if ( this.props.value !== "" || !this.props.active ) {
      return;
    }
    this.props.mark(this.props.row, this.props.column);
  },
  render: function() {
    return (
      React.createElement("td", {onClick: this.onClick}, 
        this.props.value
      )
    );
  }
});
/*
 * End Tic Tac Toe
 */
