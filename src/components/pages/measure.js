import React from 'react';
import util  from 'util';

class MeasurePage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const classes = this.props.invisible? 'invisible' : '';
    return(
      <div id="measure-page" className={classes}>
        <h2>Measure</h2>
        Index: {this.props.index} <br />
        Ports: {util.inspect(this.props.ports)}
      </div>
    );
  }
}

export default MeasurePage;
