const LineEdit = require('./lineedit.js');
const React = require('react');


class MeasurePage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div id="measure-page">
        <h4>Measure</h4>
        <LineEdit value={this.props.value} onChange={this.props.onChange}/>
      </div>
    );
  }
}

module.exports = MeasurePage;
