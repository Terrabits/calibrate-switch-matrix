import React from 'react';

function Radio(props) {
  return (
    <div className="radio">
      <label>
        <input
          type="radio"
          name={props.name}
          value={props.value}
          checked={props.checked}
          onChange={props.onChange} />
        {props.label}
      </label>
    </div>
  );
}

export default Radio;
