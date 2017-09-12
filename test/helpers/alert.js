class Alert {
  constructor() {
    this.context    = 'danger';
    this.message    = null;
  }

  showMessage(context, message) {
    this.context = context;
    this.message = message;
  }
  clear() {
    this.message = 'hidden';
  }
}

module.exports = Alert;
