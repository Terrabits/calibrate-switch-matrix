import React from 'react';
import PortTable from '../port-table/port-table.js';

function MeasurePage(props) {
  const classes = props.invisible? 'invisible' : '';
  return(
    <div id="measure-page" className={classes}>
      <div>
        <h2 className="with-step">Measure</h2>
        <h2 className="step-heading pull-right"> {props.index.step+1} / {props.index.totalSteps}</h2>
      </div>
      <p>
        Make the following port connections and click next.
      </p>
      <PortTable ports={props.ports}/>
    </div>
  );
}

export default MeasurePage;
