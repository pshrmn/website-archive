var UI = React.createClass({displayName: "UI",
  getInitialState: function() {
    return {
      room: undefined
    };
  },
  componentWillMount: function() {
    /*
    create the socket and set any events to listen for
    */
    this.socket = io();
    var _this = this;
    this.socket.on("info", function(info){
      _this.setState({
        room: info.room,
        player: info.player
      });
    });

    this.socket.on("joined", function(resp){
      _this.setState({
        formErrors: resp.reason
      });
    });

    this.socket.on("left", function(msg) {
      _this.setState({
        room: undefined,
        player: undefined,
        game: undefined
      });
    });

    this.socket.on("gameState", function(game){
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
  sendMessage: function(type, msg) {
    if ( this.state.room ) {
      msg.room = this.state.room.name;
    }
    this.socket.emit(type, msg);
  },
  render: function() {
    // when not connected to a room, show the join room form
    // otherwise show the room ui
    var room = ( this.state.room === undefined ) ? (
        React.createElement(RoomForm, {onMsg: this.sendMessage, 
                  errors: this.state.formErrors})
      ) : (
        React.createElement(Room, React.__spread({onMsg: this.sendMessage, 
              game: this.state.game, 
              choices: this.props.choices}, 
              this.state.room))
      );
    return (
      React.createElement("div", {className: "ui"}, 
         room 
      )
    );
  }
});

var RoomForm = React.createClass({displayName: "RoomForm",
  getInitialState: function() {
    return {
      nickname: "",
      room: "",
      password: "",
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return (nextState.nickname !== this.state.nickname ||
      nextState.room !== this.state.room ||
      nextState.password !== this.state.password ||
      nextProps.errors !== this.props.errors );
  },
  _formComplete: function() {
    return (this.state.nickname !== "" && this.state.room !== "" &&
      this.state.password !== "");
  },
  _resetForm: function() {
    this.setState({
      nickname: "",
      room: "",
      password: ""
    });
  },
  joinRoom: function(event) {
    event.preventDefault();
    if ( this._formComplete() ) {
      this.props.onMsg("join", this.state);
    }
  },
  setNickname: function(event) {
    this.setState({
      nickname: event.target.value
    });
  },
  setRoom: function(event) {
    this.setState({
      room: event.target.value
    });
  },
  setPassword: function(event) {
    this.setState({
      password: event.target.value
    });
  },
  render: function() {
    var hasErrors = (this.props.errors !== undefined && this.props.errors !== "");
    var errors = hasErrors ? (React.createElement("p", {className: "error"}, "Error: ", this.props.errors)) : "";
    return (
      React.createElement("div", null, 
        React.createElement("form", null, 
          errors, 
          React.createElement("p", null, 
            React.createElement("label", {htmlFor: "nickname"}, "Nickname"), 
            React.createElement("input", {type: "text", id: "nickname", 
                   value: this.state.nickname, 
                   onChange: this.setNickname})
          ), 
          React.createElement("p", null, 
            React.createElement("label", {htmlFor: "room"}, "Room"), 
            React.createElement("input", {type: "text", id: "room", 
                   value: this.state.room, 
                   onChange: this.setRoom})
          ), 
          React.createElement("p", null, 
            React.createElement("label", {htmlFor: "password"}, "Password"), 
            React.createElement("input", {type: "password", id: "password", 
                   value: this.state.password, 
                   onChange: this.setPassword})
          ), 
          React.createElement("p", null, 
            React.createElement("button", {onClick: this.joinRoom}, "Join Room")
          )
        )
      )
    );
  }
});

var Room = React.createClass({displayName: "Room",
  leaveRoom: function(event){ 
    this.props.onMsg("leave", {
      room: this.props.name
    });
  },
  signalReady: function(event){
    this.props.onMsg("ready", {});
  },
  render: function() {
    /*
    props: 
    name, owner, players, playing, you, game, choices
    */
    var readyText = "Ready";
    if ( this.props.you && this.props.you.ready ) {
      readyText = "Not Ready";
    }
    return (
      React.createElement("div", {className: "room"}, 
        React.createElement("div", {className: "room-info"}, 
          React.createElement("h2", null, this.props.name), 
          React.createElement("div", {className: "controls"}, 
            React.createElement("button", {onClick: this.leaveRoom}, "Leave Room"), 
            React.createElement("button", {onClick: this.signalReady}, 
              readyText
            )
          ), 
          React.createElement(ScoreBoard, {players: this.props.players, 
                      owner: this.props.owner, 
                      you: this.props.you})
        ), 
        React.createElement(GameBoard, {onMsg: this.props.onMsg, 
                   game: this.props.game, 
                   playing: this.props.playing, 
                   choices: this.props.choices})
      )
    );
  }
});

var ScoreBoard = React.createClass({displayName: "ScoreBoard",
    _peopleHTML: function() {
    var people = this.props.players.map(function(person, index){
      var owner = person.name === this.props.owner;
      var you = person.name === this.props.you;
      return (
        React.createElement("li", {key: index}, 
          React.createElement(Person, {name: person.name, 
                  ready: person.ready, 
                  owner: owner, 
                  you: you})
        )
      );
    }, this);
    return (
      React.createElement("div", {className: "players"}, 
        React.createElement("p", null, "Players"), 
        React.createElement("ul", null, 
          people
        )
      )
    );
  },
  render: function() {
    var people = this._peopleHTML();
    return (
      React.createElement("div", {className: "scoreboard"}, 
        people
      )
    );
  }
});

var Person = React.createClass({displayName: "Person",
  shouldComponentUpdate: function(nextProps, nextState) {
    return (nextProps.name !== this.props.name ||
      nextProps.owner !== this.props.owner ||
      nextProps.ready !== this.props.ready );
  },
  markOwner: function() {
    // a bit convoluted, but I didn't want to actually have the crown symbol
    // in the source code
    function crown() {
      return {__html: "&#9818"};
    }
    return this.props.owner ? (
      React.createElement("div", {className: "owner", dangerouslySetInnerHTML: crown()})
    ) : "";
  },
  render: function() {
    var readyClass = this.props.ready ? "ready green" : "ready gray";
    var owner = this.markOwner();
    return (
      React.createElement("div", {className: "person"}, 
        React.createElement("div", {className: readyClass}), 
        owner, 
        this.props.name, 
        this.props.you ? "(you)" : ""
      )
    );
  }
});

React.render(
  React.createElement(UI, {choices: PlayableGames}),
  document.getElementById("content")
);