import React, { Component } from 'react';

function Section(props) {
  let classes = ['nav-group-title'];
  if (props.underline) {
    classes.push('underline');
  }
  return (
    <h5 className={classes.join(' ')}>
      {props.name}
    </h5>
  );
}

export default Section;
