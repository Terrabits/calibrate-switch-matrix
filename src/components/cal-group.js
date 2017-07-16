import React     from 'react';
import ComboBox  from './combo-box.js';
import Radio     from './radio.js';

function CalGroup(props) {
  return (
    <div className="radio">
      <label>
        <input
          type="radio"
          name={props.radio.name}
          value={props.radio.value}
          checked={props.radio.checked}
          onChange={props.radio.onChange} />
        <span style={{marginRight: '10px'}}>{props.radio.label}</span>
        <ComboBox
          options={props.combo.calGroups}
          selected={props.combo.calGroup}
          disabled={!props.radio.checked}
          onChange={props.combo.onChange} />
      </label>
    </div>
  );
}

export default CalGroup;

{/* <Radio
  label="Use existing calibration"
  name="choice"
  value={Choices.EXISTING}
  checked={props.values.choice == Choices.EXISTING}
  onChange={props.onChanges.handleChoiceChange} />
<ComboBox
  options={props.values.calGroups}
  selected={props.values.calGroup}
  disabled={props.values.choice != Choices.EXISTING}
  onChange={props.onChanges.handleCalGroupChange} /> */}
