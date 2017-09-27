import React, { Component } from 'react';

function Section(props) {
  const classes = ['nav-group-title'];
  if (props.active) {
    classes.push('active');
  }
  const handleClick = () => {
    if (props.onClick) {
      props.onClick(props.index);
    }
  }
  return (
    <h5 className={classes.join(' ')} onClick={handleClick} >
      {props.name}
    </h5>
  );
}

export default Section;
