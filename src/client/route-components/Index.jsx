import React from 'react';

import JoinRoomForm from '../components/joinroom';

export default function Index(props) {  
  return (
    <div className='room'>
      <div className='room-info'>
        <JoinRoomForm />
      </div>
    </div>
  );
}
