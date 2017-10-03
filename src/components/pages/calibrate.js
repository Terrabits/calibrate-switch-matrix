import React    from 'react';
import PortList from '../port-list/port-list.js';

function CalibratePage(props) {
  let classes = props.invisible? 'invisible' : '';
  const step    = props.index.step + 1;
  const steps   = props.index.calibrationSteps;
  return (
    <div id="calibrate-page" className={classes}>
      <div>
        <h2 className="with-step">Calibrate</h2>
        <h2 className="step-heading pull-right"> {step} / {steps}</h2>
      </div>
      <p>
        Make the following connections between the VNA and the cal unit.
      </p>
      <PortList ports={props.ports} />
    </div>
  );

}

export default CalibratePage;
