var GameBoard = React.createClass({displayName: "GameBoard",
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
          React.createElement("label", {key: index}, 
            choice, 
            React.createElement("input", {type: "radio", 
                   name: "game", 
                   checked: choice === gameName, 
                   value: choice, 
                   onChange: this.sendGame})
          )
        );
      }, this);

      html = (
        React.createElement("div", null, 
          React.createElement("p", null, "Select the game to play:"), 
          choices
        )
      );
    } else {
      html = "Playing: " + gameName;
    }
    return this.props.playing ? "" : (
      React.createElement("div", {className: "gameSetup"}, 
        html
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
      case "Four":
        return (
          React.createElement(Four, React.__spread({onMsg: this.props.onMsg}, 
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
          React.createElement(TTCCell, {key: key, 
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

var TTCCell = React.createClass({displayName: "TTCCell",
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


/*
 * Four
 */

var Four = React.createClass({displayName: "Four",
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
        React.createElement(FourColumn, {key: i, 
                    pieces: c, 
                    index: i, 
                    onPlace: this.placePiece})
      );
    }, this);
  },
  render: function() {
    var player = this.props.active ? (
      React.createElement("p", null, "Current Player: ", this.props.nextPlayer)
    ) : "";
    return (
      React.createElement("div", {className: "four"}, 
        React.createElement("div", {className: "game-message"}, 
          this.props.msg
        ), 
        player, 
        React.createElement("div", {className: "board"}, 
          React.createElement("div", {className: "leg left"}), 
          this._makeColumns(), 
          React.createElement("div", {className: "leg right"}), 
          React.createElement("div", {className: "slider"})
        )
      )
    );
  }
});

var FourColumn = React.createClass({displayName: "FourColumn",
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
        React.createElement(FourPiece, {key: i, 
                   value: p})
      );
    });
    return (
      React.createElement("div", {className: "column", 
           onClick: this.tryPlace}, 
        pieces
      )
    )
  }
});

var FourPiece = React.createClass({displayName: "FourPiece",
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
      React.createElement("div", {className: spaceClassName}, 
        React.createElement("div", {className: pieceClassName})
      )
    );
  }
});

/*
 * End Four
 */