const LineEdit = require('./lineedit.js');
const React = require('react');


class CalibratePage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div id="calibrate-page">
        <h4>Calibrate</h4>
        <LineEdit value={this.props.value} onChange={this.props.onChange}/>
      </div>
    );
  }
}

module.exports = CalibratePage;
