const LineEdit = require('./lineedit.js');
const React = require('react');


class VnaPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div id="vna-page">
        <h4>Vna Address</h4>
        <LineEdit value={this.props.address} onChange={this.props.onChange}/>
      </div>
    );
  }
}

module.exports = VnaPage;
