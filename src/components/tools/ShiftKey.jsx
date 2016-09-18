import React from 'react';
import { pie, arc } from 'd3-shape';

import '../../scss/shiftkey.scss';

/*
 * The ShiftKey provides a convenient mechanism for shifting
 * a character set.
 */
class ShiftKey extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      shift: props.initialShift || 0
    };

    this.increaseShift = this.increaseShift.bind(this);
    this.decreaseShift = this.decreaseShift.bind(this);
  }

  increaseShift(event) {
    this.setState({
      shift: (this.state.shift+1) % this.props.characters.length
    });
  }

  decreaseShift(event) {
    const count = this.props.characters.length;
    this.setState({
      shift: (this.state.shift-1+count) % count
    });
  }

  render() {
    const {
      characters = [],
      radius = 200
    } = this.props;
    const {
      shift
    } = this.state;
    const padding = 10;
    
    const farRing = radius;
    const medRing = radius - 30;
    const nearRing = medRing - 30;
    const tri = 30;
    const halfTri = tri/2;
    const d = `M 0,${-halfTri} l ${tri},${halfTri} l ${-tri},${halfTri} Z`
    return (
      <div className='shift-key'>
        <svg width={radius*2+padding*2} height={radius*2+padding*2} >
          <g transform={`translate(${radius+padding},${radius+padding})`}>
            <CharacterRing characters={characters}
                           className='outer-ring'
                           outerRadius={farRing}
                           innerRadius={medRing} />
            <CharacterRing characters={shiftArray(characters, shift)}
                           className='inner-ring'
                           outerRadius={medRing}
                           innerRadius={nearRing} />
            <g>
              <g className='clickable'
                 transform={`translate(${(nearRing)/2},0)`}
                 onClick={this.increaseShift} >
                 <circle r={tri} 
                         transform={`translate(${halfTri},0)`}
                         /* this circle exists to make clicking the button easier */ />
                <path d={d} />
                <title>Click to increase the shift</title>
              </g>
              <g className='shift-amount'>
                <text dy='0.3em'>
                  {shift-characters.length} {characters[shift]} {shift}
                </text>
              </g>
              <g className='clickable'
                 transform={`translate(${-(nearRing)/2},0)`}
                 onClick={this.decreaseShift} >
                 <circle r={tri} 
                         transform={`translate(${-halfTri},0)`}
                         /* this circle exists to make clicking the button easier */ />
                <path d={d} transform='scale(-1,1)' />
                <title>Click to decrease the shift</title>
              </g>
            </g>
          </g>
        </svg>
      </div>
    );
  }
}

function CharacterRing(props) {
  const {
    characters,
    outerRadius,
    innerRadius,
    className = ''
  } = props;

  const pieLayout = pie()
    .value(1)
    .sort(null);

  const arcPath = arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const pieData = pieLayout(characters);
  return (
    <g className={className}>
      {
        pieData.map(node => {
          const [x,y] = arcPath.centroid(node);
          return (
            <g key={node.data}>
              <path d={arcPath(node)} />
              <text transform={`translate(${x},${y})`} dy='0.5em'>{node.data}</text>
            </g>
          )
        })
      }
    </g>
  );
}

function shiftArray(characters, shift) {
  return [...characters.slice(shift), ...characters.slice(0, shift)];
}


export default ShiftKey;

/*
 * A ShiftKey whose characters are the letters in the English alphabet
 */
export function AlphabetShiftKey(props) {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  return <ShiftKey characters={ALPHABET} {...props} />
};

export class CustomShiftKey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chars: ''
    };
    this.handleCharacters = this.handleCharacters.bind(this);
  }

  handleCharacters(event) {
    this.setState({
      chars: event.target.value
    });
  }

  render() {
    const {
      chars
    } = this.state;
    return (
      <div>
        <p>
          Enter the characters to use in the shift key below as one long string
          (with no spaces). For example, to create a shift key using the English
          alphabet, you would enter "ABCDEFGHIJKLMNOPQRSTUVWXYZ".
        </p>
        <input type='text'
               value={chars}
               onChange={this.handleCharacters} />
        {
          chars.length === 0 ? null : <ShiftKey characters={chars.split('')} />
        }
        
      </div>
    );
  }
}
