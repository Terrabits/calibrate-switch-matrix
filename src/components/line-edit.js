import React from 'react';

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

export default LineEdit;
