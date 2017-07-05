import React from 'react';

class Alert extends React.Component {
  constructor(props) {
    super(props);
    // this.props.context
    // this.props.message
    this.timer = null;
    this.state = {
      context: props.context,
      message: props.message
    }
  }

  showMessage(context, message) {
    this.setState({
      context: context,
      message: message
    });
  }

  setTimer() {
    let callback = () => {
      this.clearTimer();
      this.setState({
        message: null
      });
    };
    this.timer = setTimeout(callback, 5000);
  }
  clearTimer() {
    if (!this.timer) {
      return;
    }
    clearTimeout(this.timer);
    this.timer = null;
  }

  render() {
    let classes = ['alert', 'fade', 'in'];
    classes.push(`alert-${this.state.context}`)
    if (this.state.message) {
      this.setTimer();
    }
    else {
      classes.push('invisible');
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
