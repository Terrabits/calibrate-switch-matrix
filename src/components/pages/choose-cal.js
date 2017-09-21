import React     from 'react';
import {Choices} from '../../lib/calibration.js';
import CalGroup  from '../cal-group.js';
import ComboBox  from '../combo-box.js';
import LineEdit  from '../line-edit.js';
import Radio     from '../radio.js';

function ChooseCalPage(props) {
  const classes = props.invisible ? 'invisible' : '';
  const calGroupRadio = {
    label:    "Use existing calibration",
    name:     "choice",
    value:    Choices.EXISTING,
    checked:  props.values.choice == Choices.EXISTING,
    onChange: props.onChanges.handleChoiceChange
  }
  const calGroupCombo = {
    calGroup:  props.values.calGroup,
    calGroups: props.values.calGroups,
    onChange:  props.onChanges.handleCalGroupChange
  }
  const disableCalGroups = props.disabled || !props.values.calGroups || !props.values.calGroups.length
  return(
    <div id="choose-cal-page" className={classes}>
      <h2 className="no-margin-top">Choose Calibration</h2>
      <form>
        <Radio
          label="Calibrate"
          name="choice"
          value={Choices.CALIBRATE}
          checked={props.values.choice == Choices.CALIBRATE}
          onChange={props.onChanges.handleChoiceChange}
          disabled={props.disabled} />
        <CalGroup
          radio={calGroupRadio}
          combo={calGroupCombo}
          disabled={disableCalGroups} />
        <Radio
          label="None"
          name="choice"
          value={Choices.NONE}
          checked={props.values.choice == Choices.NONE}
          onChange={props.onChanges.handleChoiceChange}
          disabled={props.disabled} />
      </form>
    </div>
  );
}

export default ChooseCalPage;
