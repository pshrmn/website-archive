import React from 'react';

import Header from '../components/header';

export default function App(props) {
  return (
    <div className='ui'>
      <Header />
      {props.children}
    </div>
  );
}
