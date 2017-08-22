const app = require('electron').remote.app;

class Controller {
  constructor(model=null, view=null) {
    this.model = model;
    this.view  = view;
  }

  async close() {
    winston.debug('controller.close');
    app.quit();
  }
  async apply() {
    winston.debug('controller.apply');
    this.disableInputs();
    this.updateModel();
    await this.setSwitches();
    this.enableInputs();
  }

  // model/view control
  render() {
    winston.debug('controller.render');
    if (this.view) {
      this.view.address      = this.model.matrixAddress;
      this.view.pathFilename = this.model.pathFilename;
    }
  }
  updateModel() {
    winston.debug('controller.updateModel');
    this.model.matrixAddress  = this.view.address;
    this.model.pathFilename   = this.view.pathFilename;
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
