const React = require('react');
const Store = require('electron-store');
const store = new Store();

class LineEdit extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <input  className="form-control" type="text" value={this.props.value} onChange={this.props.onChange} />
      </div>
    );
  }
}

module.exports = LineEdit;
