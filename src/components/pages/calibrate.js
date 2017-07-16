import React from 'react';
import PortList from '../port-list/port-list.js';

function CalibratePage(props) {
  let classes = props.invisible? 'invisible' : '';
  return (
    <div id="calibrate-page" className={classes}>
      <div>
        <h2 className="with-step">Calibrate</h2>
        <h2 className="step-heading pull-right"> {props.index.step+1} / {props.index.totalSteps}</h2>
      </div>
      <p>
        Connect the following VNA ports to any cal unit port. The VNA will auto-detect the connections you make.
      </p>
      <PortList ports={props.ports} />
    </div>
  );

}

export default CalibratePage;
