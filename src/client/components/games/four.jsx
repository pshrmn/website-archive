import React from 'react';

const Four = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return this.props.id !== nextProps.id;
  },
  /*
   * determine where the piece will be placed, and after placing, check if
   * the game has been won
   */
  placePiece: function(column) {
    this.props.submitTurn(
      this.props.roomName,
      {
        column: column
      }
    );
  },
  render: function() {
    const {
      active,
      nextPlayer,
      msg
    } = this.props;
    return (
      <div className='four'>
        <div className='game-message'>
          {msg}
        </div>
        { active ? <p>Current Player: {nextPlayer}</p> : null }
        <div className='board'>
          <div className='leg left'></div>
          {this.props.board.map((c, i) => 
            <Column key={i}
                    pieces={c}
                    index={i}
                    onPlace={this.placePiece} />
          )}
          <div className='leg right'></div>
          <div className='slider'></div>
        </div>
      </div>
    );
  }
});

var Column = React.createClass({
  tryPlace: function(event) {
    // filled from the bottom up, so first spot is last filled
    if ( this.props.pieces[0] === '' ) {
      this.setState({
        preview: undefined
      });
      this.props.onPlace(this.props.index);
    }
  },
  render: function() {
    return (
      <div className='column'
           onClick={this.tryPlace} >
        { this.props.pieces.map((p, i) => <Piece key={i} value={p} />) }
      </div>
    );
  }
});

var Piece = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return (nextProps.value !== this.props.value);
  },
  render: function() {
    const className = this.props.value === '' ? 'none' : this.props.value;
    const pieceClasses = ['piece', className];
    const spaceClasses = ['space'];
    const pieceClassName = pieceClasses.join(' ');
    const spaceClassName = spaceClasses.join(' ');
    return (
      <div className={spaceClassName}>
        <div className={pieceClassName}></div>
      </div>
    );
  }
});

export default Four;