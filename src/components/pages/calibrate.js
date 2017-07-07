import React from 'react';

function CalibratePage(props) {
  const classes = props.invisible? 'invisible' : '';
  return (
    <div id="calibrate-page" className={classes}>
      <h4>Calibration Step {props.index}</h4>
      <p>
        Connect the following VNA ports to any cal unit port. The VNA will auto-detect the connections you make.
      </p>
      <h2>VNA Ports {props.ports.join(", ")}</h2>
    </div>
  );

}

export default CalibratePage;
