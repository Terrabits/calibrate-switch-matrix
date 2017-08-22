const remote = require('electron').remote;

class Controller {
  constructor(model=null, view=null) {
    this.model = model;
    this.view  = view;
  }

  async close() {
    winston.debug('controller.close');
    remote.getCurrentWindow().close();
  }
  async apply() {
    winston.debug('controller.apply');
    this.updateModel();
    if (!this.model.matrixAddress) {
      this.view.alert.showMessage('danger', 'Enter IP address');
      return;
    }
    if (!this.model.pathFilename) {
      this.view.alert.showMessage('danger', 'Choose path file');
      return;
    }
    this.disableInputs();
    try {
      await this.setSwitches();
      this.view.alert.showMessage('success', 'Switch path set!');
    }
    catch (err) {
      if (err && err.message) {
        this.view.alert.showMessage('danger',  err.message);
      }
      else {
        this.view.alert.showMessage('danger', err);
      }
    }
    this.enableInputs();
  }

  // model/view control
  render() {
    winston.debug('controller.render');
    if (this.view) {
      this.view.address  = this.model.matrixAddress;
      this.view.filename = this.model.pathFilename;
    }
  }
  updateModel() {
    winston.debug('controller.updateModel');
    this.model.matrixAddress  = this.view.address;
    this.model.pathFilename   = this.view.filename;
  }
  disableInputs(value=true) {
    this.view.disableInputs = value;
  }
  enableInputs(value=true) {
    this.disableInputs(!value);
  }
  async setSwitches() {
    winston.debug('controller.setSwitches');
    await model.setSwitches();
  }
}

module.exports = Controller;
