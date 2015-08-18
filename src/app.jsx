var UI = React.createClass({
  getInitialState: function() {
    return {
      room: undefined
    };
  },
  componentWillMount: function() {
    this.socket = io();
    var _this = this;
    this.socket.on("room", function(room){
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
        <RoomForm socket={this.socket} />
      );
    } else {
      room = (
        <Room {...this.state.room} />
      );
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
      <form>
        <label>Nickname: <input type="text" ref="nickname" /></label>
        <label>Room: <input type="text" ref="name" /></label>
        <label>Password: <input type="password" ref="password" /></label>
        <button onClick={this.makeRoom}>Make Room</button>
        <button onClick={this.joinRoom}>Join Room</button>
      </form>
    );
  }
});

var Room = React.createClass({
  _peopleHTML: function() {
    var people = this.props.people.map(function(person, index){
      return (
        <li key={index}>{person}</li>
      );
    });
    return (
      <ul>
        {people}
      </ul>
    );
  },
  render: function() {
    var people = this._peopleHTML();
    return (
      <div className="room">
        <h2>{this.props.name}</h2>
        {people}
      </div>
    )
  }
})

React.render(
  <UI />,
  document.getElementById("content")
)