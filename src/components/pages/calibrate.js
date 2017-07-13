import React from 'react';

function CalibratePage(props) {
  const classes = props.invisible? 'invisible' : '';
  return (
    <div id="calibrate-page" className={classes}>
      <h2>Calibrate</h2>
      <h4>Calibration Step {props.index.step+1} of {props.index.totalSteps}</h4>
      <p>
        Connect the following VNA ports to any cal unit port. The VNA will auto-detect the connections you make.
      </p>
      <h2>VNA Ports {props.ports.join(", ")}</h2>
    </div>
  );

}

export default CalibratePage;
