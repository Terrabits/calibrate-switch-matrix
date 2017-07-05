const LineEdit = require('./lineedit.js');
const React = require('react');


class ChooseCalibrationPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div id="choose-calibration-page">
        <h4>Choose Calibration</h4>
        <LineEdit value={this.props.choice} onChange={this.props.onChange}/>
      </div>
    );
  }
}

module.exports = ChooseCalibrationPage;
