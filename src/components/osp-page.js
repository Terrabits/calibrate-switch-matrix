const LineEdit = require('./lineedit.js');
const React = require('react');


class OspPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div id="osp-page">
        <h4>Switch Matrix Address</h4>
        <LineEdit value={this.props.address} onChange={this.props.onChange}/>
      </div>
    );
  }
}

module.exports = OspPage;
