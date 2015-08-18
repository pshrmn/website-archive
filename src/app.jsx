var UI = React.createClass({
  getInitialState: function() {
    return {
      room: undefined
    };
  },
  componentWillMount: function() {
    this.socket = io();
    var _this = this;
    this.socket.on("room joined", function(info) {
      if ( !info.error ) {
        _this.setState({
          room: info.name
        })
      }
    });
  },
  setRoom: function(room) {
    this.setState({
      room: room
    });
  },
  render: function() {
    var room;
    // when not connected to a room, show the join room form
    // otherwise show the room ui
    if ( this.state.room === undefined ) {
     room = (
      <RoomForm socket={this.socket}
                setRoom={this.setRoom} />
      );
    } else {
      room = (
        <div>{this.state.room}</div>
      )
    }
    return (
      <div className="ui">
        { room }   
      </div>
    );
  }
});

var RoomForm = React.createClass({
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
        name: nameVal,
        password: passVal
      }
    };
  },
  render: function() {
    return (
      <form>
        <label>Room: <input type="text" ref="name" /></label>
        <label>Password: <input type="password" ref="password" /></label>
        <button onClick={this.makeRoom}>Make Room</button>
        <button onClick={this.joinRoom}>Join Room</button>
      </form>
    );
  }
});

React.render(
  <UI />,
  document.getElementById("content")
)