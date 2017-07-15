import React from 'react';
import Table from '../table/table.js';

function MeasurePage(props) {
  const classes = props.invisible? 'invisible' : '';
  return(
    <div id="measure-page" className={classes}>
      <h2>Measure</h2>
      <h4>Measurement Step {props.index.step+1} of {props.index.totalSteps}</h4>
      <p>
        Make the following port connections and click next
      </p>
      <Table />
    </div>
  );
}

export default MeasurePage;
