import React from 'react';
import util  from 'util';

function MeasurePage(props) {
  const classes = props.invisible? 'invisible' : '';
  let ports = '';
  if (props.ports) {
    for (let key of Object.keys(props.ports)) {
      ports = ports + `${key} => ${props.ports[key]}\n`;
    }
  }
  return(
    <div id="measure-page" className={classes}>
      <h2>Measure</h2>
      <h4>Measurement Step {props.index.step+1} of {props.index.totalSteps}</h4>
      <p>
        Make the following port connections and click next
      </p>
      <h2>{ports}</h2>
    </div>
  );
}

export default MeasurePage;
