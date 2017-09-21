import React from 'react';
import "../assets/css/alert.scss";

class Alert extends React.Component {
  constructor(props) {
    super(props);
    // this.props.context
    // this.props.message
    this.timer = null;
    this.state = {
      visible: false,
      context: props.context? props.context : 'success',
      message: props.message? props.message : 'hidden'
    }
  }

  showMessage(context, message) {
    this.setState({
      visible: true,
      context: context,
      message: message
    });
  }
  clear() {
    this.setState({
      visible: false,
      context: 'success',
      message: 'hidden'
    });
  }

  render() {
    let classes = ['alert', 'alert-dismissible'];
    classes.push(`alert-${this.state.context}`)
    if (!this.state.visible) {
      classes.push('hidden');
    }
    const className = classes.join(' ');
    const handleClick = () => { this.clear(); };
    return (
      <div className={className}>
        <a href="#" className="close" data-dismiss="alert" aria-label="close" onClick={handleClick}>&times;</a>
        {this.state.message}
      </div>
    );
  }
}

export default Alert;
