var UI = React.createClass({displayName: "UI",
  componentWillMount: function() {
    this.socket = io();
  },
  render: function() {
    return (
      React.createElement("div", {className: "ui"}, 
        React.createElement(RoomForm, {socket: this.socket})
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
    var name = React.findDOMNode(this.refs.name);
    var password = React.findDOMNode(this.refs.password);
    if ( name.value === "" || password === "" ) {
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
        name: name.value,
        password: password.value
      }
    };
  },
  render: function() {
    return (
      React.createElement("form", null, 
        React.createElement("label", null, "Room: ", React.createElement("input", {type: "text", ref: "name"})), 
        React.createElement("label", null, "Password: ", React.createElement("input", {type: "password", ref: "password"})), 
        React.createElement("button", {onClick: this.makeRoom}, "Make Room"), 
        React.createElement("button", {onClick: this.joinRoom}, "Join Room")
      )
    );
  }
});

React.render(
  React.createElement(UI, null),
  document.getElementById("content")
)