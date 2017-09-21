import React     from 'react';

function Option(props) {
  return (
    <option value={props.value}>
      {props.value}
    </option>
  );
}

function ComboBox(props) {
  const options = [];
  if (props.options && props.options.length) {
    for (let option of props.options) {
      options.push(
        <Option
          key={option}
          value={option}
        />
      );
    }
  }
  const classes = [];
  if (props.disabled) {
    classes.push('disabled');
  }
  return (
    <select
      className={classes}
      value={props.selected}
      onChange={props.onChange}
      disabled={!!props.disabled}
    >
      {options}
    </select>
  );
}

export default ComboBox;
