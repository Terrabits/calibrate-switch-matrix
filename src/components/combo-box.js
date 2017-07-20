import React     from 'react';

function Option(props) {
  return (
    <option value={props.value}>
      {props.value}
    </option>
  );
}

function ComboBox(props) {
  const disabled = props.disabled? !!props.disabled : false;
  const options = [];
  if (props.options && props.options.length) {
    for (let option of props.options) {
      if (option == props.selected) {
        options.push(
          <Option
            key={option}
            value={option}
            selected
          />
        );
      }
      else {
        options.push(
          <Option
            key={option}
            value={option}
          />
        );
      }
    }
  }
  const classes = disabled? 'invisible' : '';
  return (
    <select
      className={classes}
      onChange={props.onChange}
    >
      {options}
    </select>
  );
}

export default ComboBox;
