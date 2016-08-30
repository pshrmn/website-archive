import React from 'react';
import { IndexLink } from 'react-router';

export default function Header(props) {
  return (
    <header>
      <IndexLink to='/' id='home'>We Play</IndexLink>
    </header>
  );
}