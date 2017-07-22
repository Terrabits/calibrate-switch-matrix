import React from 'react';

function Radio(props) {
  const classes = ['radio'];
  if (props.disabled) {
    classes.push('disabled');
  }
  return (
    <div className={classes.join(' ')}>
      <label>
        <input
          type="radio"
          name={props.name}
          value={props.value}
          checked={props.checked}
          onChange={props.onChange}
          disabled={!!props.disabled} />
        {props.label}
      </label>
    </div>
  );
}

export default Radio;
