var UI = React.createClass({displayName: "UI",
  getInitialState: function() {
    return {
      room: undefined
    };
  },
  componentWillMount: function() {
    this.socket = io();
    var _this = this;
    this.socket.on("room", function(room){
      console.log("received a room");
      _this.setState({
        room: room
      });
    })
  },
  render: function() {
    var room;
    // when not connected to a room, show the join room form
    // otherwise show the room ui
    if ( this.state.room === undefined ) {
      room = (
        React.createElement(RoomForm, {socket: this.socket})
      );
    } else {
      room = (
        React.createElement(Room, React.__spread({},  this.state.room))
      );
    }
    return (
      React.createElement("div", {className: "ui"}, 
         room 
      )
    );
  }
});

var RoomForm = React.createClass({displayName: "RoomForm",
  makeRoom: function(event) {
    event.preventDefault();
    var info = this._roomInfo();
    if ( !info.error ) {
      this.props.socket.emit("create room", info.info);
    }
  },
  joinRoom: function(event) {
    event.preventDefault();
    var info = this._roomInfo();
    if ( !info.error ) {
      this.props.socket.emit("join room", info.info);
    }
  },
  _roomInfo: function() {
    var nickname = React.findDOMNode(this.refs.nickname);
    var name = React.findDOMNode(this.refs.name);
    var password = React.findDOMNode(this.refs.password);

    var nicknameVal = nickname.value;
    var nameVal = name.value;
    var passVal = password.value;
    if ( nameVal === "" || passVal === "" ) {
      return {
        error: true,
        info: {}
      };
    }
    name.value = "";
    password.value = "";
    return {
      error: false,
      info: {
        nickname: nicknameVal,
        name: nameVal,
        password: passVal
      }
    };
  },
  render: function() {
    return (
      React.createElement("form", null, 
        React.createElement("label", null, "Nickname: ", React.createElement("input", {type: "text", ref: "nickname"})), 
        React.createElement("label", null, "Room: ", React.createElement("input", {type: "text", ref: "name"})), 
        React.createElement("label", null, "Password: ", React.createElement("input", {type: "password", ref: "password"})), 
        React.createElement("button", {onClick: this.makeRoom}, "Make Room"), 
        React.createElement("button", {onClick: this.joinRoom}, "Join Room")
      )
    );
  }
});

var Room = React.createClass({displayName: "Room",
  _peopleHTML: function() {
    var people = this.props.people.map(function(person, index){
      return (
        React.createElement("li", {key: index}, person)
      );
    });
    return (
      React.createElement("ul", null, 
        people
      )
    );
  },
  render: function() {
    var people = this._peopleHTML();
    return (
      React.createElement("div", {className: "room"}, 
        React.createElement("h2", null, this.props.name), 
        people
      )
    )
  }
})

React.render(
  React.createElement(UI, null),
  document.getElementById("content")
)