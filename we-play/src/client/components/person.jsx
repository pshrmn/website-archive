import React from 'react';

export default function Person(props) {
  const {
    ready,
    you,
    owner,
    wins,
    losses,
    name
  } = props;
  return (
    <li className={you ? 'person you' : 'person'}>
      <div className={ready ? 'ready green' : 'ready gray'}></div>
      {name}
      {
        <div className='symbols'>
          {owner ? <span title='owner'>{String.fromCharCode(9818)}</span> : ''}
        </div>
      } ({wins}-{losses})
    </li>
  );
}
