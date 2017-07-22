import React from 'react';
import '../assets/css/overlay.scss';
import cat from '../assets/images/running cat.gif';

function Overlay(props) {
  const classes = ['overlay'];
  if (!props.on) {
    classes.push('invisible');
  }
  return (
    <div className={classes.join(' ')}>
      <div className="helper" />
      <img src={cat} />
    </div>
  );
}

export default Overlay;
