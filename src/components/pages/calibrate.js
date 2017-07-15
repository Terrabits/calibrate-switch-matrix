import React from 'react';
import Table from '../table/table.js';

function CalibratePage(props) {
  let classes = props.invisible? 'invisible' : '';
  classes = classes + ' container';
  let ports = [];
  if (props.ports && Array.isArray(props.ports)) {
    ports = props.ports;
  }
  return (
    <div id="calibrate-page" className={classes}>
      <h2>Calibrate</h2>
      <h4>step {props.index.step+1} of {props.index.totalSteps}</h4>
      <h4>
        Connect the following VNA ports to any cal unit port.The VNA will auto-detect the connections you make.
      </h4>
      <Table />
    </div>
  );

}

export default CalibratePage;
