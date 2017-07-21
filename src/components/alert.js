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
    this.setTimer();
  }
  clear() {
    this.clearTimer();
    this.setState({
      visible: false,
      context: 'success',
      message: 'hidden'
    });
  }

  setTimer() {
    let handleTimeout = () => {
      this.clearTimer();
      this.setState({
        visible: false,
        message: 'hidden'
      });
    };
    this.timer = setTimeout(handleTimeout, 7000);
  }
  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  render() {
    let classes = ['alert'];
    classes.push(`alert-${this.state.context}`)
    if (!this.state.visible) {
      classes.push('hidden');
    }
    const className = classes.join(' ');
    return (
      <div className={className}>
        {this.state.message}
      </div>
    );
  }
}

export default Alert;
