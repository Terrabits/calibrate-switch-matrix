const LineEdit = require('./lineedit.js');
const React = require('react');


class ProcedurePage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div id="procedure-page">
        <h4>Procedure</h4>
        <LineEdit value={this.props.filename} onChange={this.props.onChange}/>
      </div>
    );
  }
}

module.exports = ProcedurePage;
