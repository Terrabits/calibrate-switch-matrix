import React from 'react';

function Button(props) {
  const classes = ['btn'];
  if (props.role) {
    classes.push(`btn-${props.role}`);
  }
  if (props.pullRight) {
    classes.push('pull-right');
  }
  if (props.disabled) {
    classes.push('disabled');
  }
  return (
    <button
      className={classes.join(' ')}
      onClick={props.onClick}
      disabled={!!props.disabled}
    >
      {props.text}
    </button>
  );
}

export default Button;
