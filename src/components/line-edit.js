import React from 'react';

function LineEdit(props) {
  const classes = ['form-control'];
  if (props.disabled) {
    classes.push('disabled');
  }
  return (
    <div className="form-group">
      <label>{props.label}</label>
      <input
        className={classes.join(' ')}
        type="text"
        value={props.value}
        onChange={props.onChange? props.onChange : null}
        disabled={!!props.disabled}
      />
    </div>
  );
}

export default LineEdit;
