import React from 'react';

class LineEdit extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="form-group">
        <label>{this.props.label}</label>
        <input
          className="form-control"
          type="text"
          value={this.props.value} onChange={this.props.onChange}
          disabled={!!this.props.disabled}
        />
      </div>

    );
  }
}

export default LineEdit;
