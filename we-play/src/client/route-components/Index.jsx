import React from 'react';

import { LoginForm } from '../components/roomform';

export default function Index(props) {  
  return (
    <div className='room'>
      <div className='room-info'>
        <LoginForm />
      </div>
    </div>
  );
}
