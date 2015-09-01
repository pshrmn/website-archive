/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _socketIo = __webpack_require__(2);

	var _socketIo2 = _interopRequireDefault(_socketIo);

	var _games = __webpack_require__(3);

	var _games2 = _interopRequireDefault(_games);

	var UI = _react2["default"].createClass({
	  displayName: "UI",

	  getInitialState: function getInitialState() {
	    return {
	      room: undefined
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    /*
	    create the socket and set any events to listen for
	    */
	    this.socket = (0, _socketIo2["default"])();
	    var _this = this;
	    this.socket.on("info", function (info) {
	      _this.setState({
	        room: info.room,
	        player: info.player
	      });
	    });

	    this.socket.on("joined", function (resp) {
	      _this.setState({
	        formErrors: resp.reason
	      });
	    });

	    this.socket.on("left", function (msg) {
	      _this.setState({
	        room: undefined,
	        player: undefined,
	        game: undefined
	      });
	    });

	    this.socket.on("gameState", function (game) {
	      _this.setState({
	        game: game
	      });
	    });
	  },
	  /*
	   * takes a message and sends it to the server
	   * appends the name of the room for room specific commands
	   * because of that, msg has to be an object
	   */
	  sendMessage: function sendMessage(type, msg) {
	    if (this.state.room) {
	      msg.room = this.state.room.name;
	    }
	    this.socket.emit(type, msg);
	  },
	  render: function render() {
	    // when not connected to a room, show the join room form
	    // otherwise show the room ui
	    var room = this.state.room === undefined ? _react2["default"].createElement(RoomForm, { onMsg: this.sendMessage,
	      errors: this.state.formErrors }) : _react2["default"].createElement(Room, _extends({ onMsg: this.sendMessage,
	      game: this.state.game
	    }, this.state.room));
	    return _react2["default"].createElement(
	      "div",
	      { className: "ui" },
	      room
	    );
	  }
	});

	var RoomForm = _react2["default"].createClass({
	  displayName: "RoomForm",

	  getInitialState: function getInitialState() {
	    return {
	      nickname: "",
	      room: "",
	      password: ""
	    };
	  },
	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    return nextState.nickname !== this.state.nickname || nextState.room !== this.state.room || nextState.password !== this.state.password || nextProps.errors !== this.props.errors;
	  },
	  _formComplete: function _formComplete() {
	    return this.state.nickname !== "" && this.state.room !== "" && this.state.password !== "";
	  },
	  _resetForm: function _resetForm() {
	    this.setState({
	      nickname: "",
	      room: "",
	      password: ""
	    });
	  },
	  joinRoom: function joinRoom(event) {
	    event.preventDefault();
	    if (this._formComplete()) {
	      this.props.onMsg("join", this.state);
	    }
	  },
	  setNickname: function setNickname(event) {
	    this.setState({
	      nickname: event.target.value
	    });
	  },
	  setRoom: function setRoom(event) {
	    this.setState({
	      room: event.target.value
	    });
	  },
	  setPassword: function setPassword(event) {
	    this.setState({
	      password: event.target.value
	    });
	  },
	  render: function render() {
	    var hasErrors = this.props.errors !== undefined && this.props.errors !== "";
	    var errors = hasErrors ? _react2["default"].createElement(
	      "p",
	      { className: "error" },
	      "Error: ",
	      this.props.errors
	    ) : "";
	    return _react2["default"].createElement(
	      "div",
	      null,
	      _react2["default"].createElement(
	        "form",
	        null,
	        errors,
	        _react2["default"].createElement(
	          "p",
	          null,
	          _react2["default"].createElement(
	            "label",
	            { htmlFor: "nickname" },
	            "Nickname"
	          ),
	          _react2["default"].createElement("input", { type: "text", id: "nickname",
	            value: this.state.nickname,
	            onChange: this.setNickname })
	        ),
	        _react2["default"].createElement(
	          "p",
	          null,
	          _react2["default"].createElement(
	            "label",
	            { htmlFor: "room" },
	            "Room"
	          ),
	          _react2["default"].createElement("input", { type: "text", id: "room",
	            value: this.state.room,
	            onChange: this.setRoom })
	        ),
	        _react2["default"].createElement(
	          "p",
	          null,
	          _react2["default"].createElement(
	            "label",
	            { htmlFor: "password" },
	            "Password"
	          ),
	          _react2["default"].createElement("input", { type: "password", id: "password",
	            value: this.state.password,
	            onChange: this.setPassword })
	        ),
	        _react2["default"].createElement(
	          "p",
	          null,
	          _react2["default"].createElement(
	            "button",
	            { onClick: this.joinRoom },
	            "Join Room"
	          )
	        )
	      )
	    );
	  }
	});

	var Room = _react2["default"].createClass({
	  displayName: "Room",

	  leaveRoom: function leaveRoom(event) {
	    this.props.onMsg("leave", {
	      room: this.props.name
	    });
	  },
	  signalReady: function signalReady(event) {
	    this.props.onMsg("ready", {});
	  },
	  render: function render() {
	    /*
	    props: 
	    game
	    gameInfo
	      currentGame
	      gameChoices
	      playing
	    name
	    onMsg
	    people
	      max
	      owner
	      players
	      you
	    */
	    var you = this.props.people.you;
	    var readyText = you && you.ready ? "Not Ready" : "Ready";
	    var isOwner = you && you.name === this.props.people.owner;
	    return _react2["default"].createElement(
	      "div",
	      { className: "room" },
	      _react2["default"].createElement(
	        "div",
	        { className: "room-info" },
	        _react2["default"].createElement(
	          "h2",
	          null,
	          this.props.name
	        ),
	        _react2["default"].createElement(
	          "div",
	          { className: "controls" },
	          _react2["default"].createElement(
	            "button",
	            { onClick: this.leaveRoom },
	            "Leave Room"
	          ),
	          _react2["default"].createElement(
	            "button",
	            { onClick: this.signalReady },
	            readyText
	          )
	        ),
	        _react2["default"].createElement(ScoreBoard, this.props.people)
	      ),
	      _react2["default"].createElement(_games2["default"], _extends({ onMsg: this.props.onMsg,
	        game: this.props.game,
	        isOwner: isOwner,
	        you: this.props.people.you
	      }, this.props.gameInfo))
	    );
	  }
	});

	var ScoreBoard = _react2["default"].createClass({
	  displayName: "ScoreBoard",

	  _peopleHTML: function _peopleHTML() {
	    var people = this.props.players.map(function (person, index) {
	      var owner = person.name === this.props.owner;
	      var you = person.name === this.props.you.name;
	      return _react2["default"].createElement(
	        "li",
	        { key: index },
	        _react2["default"].createElement(Person, { name: person.name,
	          ready: person.ready,
	          owner: owner,
	          you: you })
	      );
	    }, this);
	    return _react2["default"].createElement(
	      "div",
	      { className: "players" },
	      _react2["default"].createElement(
	        "p",
	        null,
	        "Players (",
	        this.props.players.length,
	        "/",
	        this.props.max,
	        ")"
	      ),
	      _react2["default"].createElement(
	        "ul",
	        null,
	        people
	      )
	    );
	  },
	  render: function render() {
	    var people = this._peopleHTML();
	    return _react2["default"].createElement(
	      "div",
	      { className: "scoreboard" },
	      people
	    );
	  }
	});

	var Person = _react2["default"].createClass({
	  displayName: "Person",

	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    return nextProps.name !== this.props.name || nextProps.owner !== this.props.owner || nextProps.ready !== this.props.ready;
	  },
	  _userSymbols: function _userSymbols() {
	    var owner = this.props.owner ? _react2["default"].createElement(
	      "span",
	      { title: "owner" },
	      String.fromCharCode(9818)
	    ) : "";
	    var you = this.props.you ? _react2["default"].createElement(
	      "span",
	      { title: "you" },
	      String.fromCharCode(10004)
	    ) : "";
	    return _react2["default"].createElement(
	      "div",
	      { className: "symbols" },
	      owner,
	      you
	    );
	  },
	  render: function render() {
	    var readyClass = this.props.ready ? "ready green" : "ready gray";
	    var symbols = this._userSymbols();
	    return _react2["default"].createElement(
	      "div",
	      { className: "person" },
	      _react2["default"].createElement("div", { className: readyClass }),
	      this.props.name,
	      symbols
	    );
	  }
	});

	_react2["default"].render(_react2["default"].createElement(UI, null), document.getElementById("content"));

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = io;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _tictactoe = __webpack_require__(4);

	var _tictactoe2 = _interopRequireDefault(_tictactoe);

	var _four = __webpack_require__(5);

	var _four2 = _interopRequireDefault(_four);

	exports["default"] = _react2["default"].createClass({
	  displayName: "games",

	  sendGame: function sendGame(event) {
	    var game = event.target.value;
	    this.props.onMsg("set game", {
	      game: game
	    });
	  },
	  _gameSetup: function _gameSetup() {
	    var gameName = this.props.currentGame;
	    var html;
	    if (this.props.isOwner) {
	      var choices = this.props.gameChoices.map(function (choice, index) {
	        return _react2["default"].createElement(
	          "label",
	          { key: index },
	          choice,
	          _react2["default"].createElement("input", { type: "radio",
	            name: "game",
	            checked: choice === gameName,
	            value: choice,
	            onChange: this.sendGame })
	        );
	      }, this);

	      html = _react2["default"].createElement(
	        "div",
	        null,
	        _react2["default"].createElement(
	          "p",
	          null,
	          "Select the game to play:"
	        ),
	        choices
	      );
	    } else {
	      html = "Playing: " + gameName;
	    }
	    return this.props.playing ? "" : _react2["default"].createElement(
	      "div",
	      { className: "gameSetup" },
	      html
	    );
	  },
	  _gameComponent: function _gameComponent() {
	    var game;
	    if (this.props.game) {
	      switch (this.props.game.name) {
	        case "Tic Tac Toe":
	          game = _react2["default"].createElement(_tictactoe2["default"], _extends({ onMsg: this.props.onMsg,
	            you: this.props.you
	          }, this.props.game));
	          break;
	        case "Four":
	          game = _react2["default"].createElement(_four2["default"], _extends({ onMsg: this.props.onMsg,
	            you: this.props.you
	          }, this.props.game));
	          break;
	        default:
	          game = "";
	      }
	    }
	    var turn = "";
	    if (this.props.game) {
	      turn = this.props.game.nextPlayer === this.props.you.name ? "Your Turn" : this.props.game.nextPlayer + "'s Turn";
	    }
	    return _react2["default"].createElement(
	      "div",
	      { className: "game" },
	      turn,
	      game
	    );
	  },
	  render: function render() {
	    /*
	    game
	    isOwner
	    you
	    gameInfo
	      currentGame
	      playing
	      gameChoices
	    */
	    var setup = this.props.playing ? "" : this._gameSetup();
	    var game = this._gameComponent();
	    return _react2["default"].createElement(
	      "div",
	      { className: "gameBoard" },
	      setup,
	      game
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	exports["default"] = _react2["default"].createClass({
	  displayName: "tictactoe",

	  sendPosition: function sendPosition(row, column) {
	    this.props.onMsg("gameState", {
	      row: row,
	      column: column
	    });
	  },
	  render: function render() {
	    var sendPosition = this.sendPosition;
	    var active = this.props.active;
	    var rows = this.props.board.map(function (row, rowIndex) {
	      var cells = row.map(function (cell, colIndex) {
	        var key = rowIndex + "," + colIndex;
	        return _react2["default"].createElement(Cell, { key: key,
	          active: active,
	          value: cell,
	          row: rowIndex,
	          column: colIndex,
	          mark: sendPosition });
	      });

	      return _react2["default"].createElement(
	        "tr",
	        { key: rowIndex },
	        cells
	      );
	    });
	    var player = this.props.active ? _react2["default"].createElement(
	      "p",
	      null,
	      "Current Player: ",
	      this.props.nextPlayer
	    ) : "";
	    return _react2["default"].createElement(
	      "div",
	      { className: "tictactoe" },
	      _react2["default"].createElement(
	        "p",
	        null,
	        this.props.msg
	      ),
	      player,
	      _react2["default"].createElement(
	        "table",
	        { className: "board", cellSpacing: "0" },
	        rows
	      )
	    );
	  }
	});

	var Cell = _react2["default"].createClass({
	  displayName: "Cell",

	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    return nextProps.value !== this.props.value;
	  },
	  onClick: function onClick(event) {
	    // don't send to server when the cell is already marked
	    if (this.props.value !== "" || !this.props.active) {
	      return;
	    }
	    this.props.mark(this.props.row, this.props.column);
	  },
	  render: function render() {
	    return _react2["default"].createElement(
	      "td",
	      { onClick: this.onClick },
	      this.props.value
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	exports["default"] = _react2["default"].createClass({
	  displayName: "four",

	  /*
	   * determine where the piece will be placed, and after placing, check if
	   * the game has been won
	   */
	  placePiece: function placePiece(column) {
	    this.props.onMsg("gameState", {
	      column: column
	    });
	  },
	  _makeColumns: function _makeColumns() {
	    return this.props.board.map(function (c, i) {
	      return _react2["default"].createElement(Column, { key: i,
	        pieces: c,
	        index: i,
	        onPlace: this.placePiece });
	    }, this);
	  },
	  render: function render() {
	    var player = this.props.active ? _react2["default"].createElement(
	      "p",
	      null,
	      "Current Player: ",
	      this.props.nextPlayer
	    ) : "";
	    return _react2["default"].createElement(
	      "div",
	      { className: "four" },
	      _react2["default"].createElement(
	        "div",
	        { className: "game-message" },
	        this.props.msg
	      ),
	      player,
	      _react2["default"].createElement(
	        "div",
	        { className: "board" },
	        _react2["default"].createElement("div", { className: "leg left" }),
	        this._makeColumns(),
	        _react2["default"].createElement("div", { className: "leg right" }),
	        _react2["default"].createElement("div", { className: "slider" })
	      )
	    );
	  }
	});

	var Column = _react2["default"].createClass({
	  displayName: "Column",

	  tryPlace: function tryPlace(event) {
	    if (this._canPlace()) {
	      this.setState({
	        preview: undefined
	      });
	      this.props.onPlace(this.props.index);
	    }
	  },
	  _canPlace: function _canPlace() {
	    // filled from the bottom up, so first spot is last filled
	    return this.props.pieces[0] === "";
	  },
	  render: function render() {
	    var pieces = this.props.pieces.map(function (p, i) {
	      return _react2["default"].createElement(Piece, { key: i,
	        value: p });
	    });
	    return _react2["default"].createElement(
	      "div",
	      { className: "column",
	        onClick: this.tryPlace },
	      pieces
	    );
	  }
	});

	var Piece = _react2["default"].createClass({
	  displayName: "Piece",

	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    return nextProps.value !== this.props.value;
	  },
	  render: function render() {
	    var className = this.props.value === "" ? "none" : this.props.value;
	    var pieceClasses = ["piece", className];
	    var spaceClasses = ["space"];
	    var pieceClassName = pieceClasses.join(" ");
	    var spaceClassName = spaceClasses.join(" ");
	    return _react2["default"].createElement(
	      "div",
	      { className: spaceClassName },
	      _react2["default"].createElement("div", { className: pieceClassName })
	    );
	  }
	});
	module.exports = exports["default"];

/***/ }
/******/ ]);