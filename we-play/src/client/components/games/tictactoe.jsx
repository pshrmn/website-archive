import React from 'react';

import { submitTurn } from '../../actions';

const TicTacToe = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return this.props.id !== nextProps.id;
  },
  sendPosition: function(row, column) {
    this.props.submitTurn(
      this.props.roomName,
      {
        row: row,
        column: column
      }
    );
  },
  render: function() {
    const {
      msg,
      active,
      board,
      nextPlayer
    } = this.props;
    const rows = board.map((row, rowIndex) => {
      const cells = row.map((cell, colIndex) => 
        <Cell key={`${rowIndex},${colIndex}`}
              active={this.props.active}
              value={cell}
              row={rowIndex}
              column={colIndex}
              mark={this.sendPosition} />
      );

      return (
        <tr key={rowIndex}>
          {cells}
        </tr>
      );
    });

    return (
      <div className='tictactoe'>
        <p>{msg}</p>
        { active ? <p>Current Player: {nextPlayer}</p> : null }
        <table className='board' cellSpacing='0'>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
});

var Cell = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.value !== this.props.value;
  },
  onClick: function(event){
    // don't send to server when the cell is already marked
    if ( this.props.value !== '' || !this.props.active ) {
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

export default TicTacToe;
