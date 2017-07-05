const PageIndex = require('./page-index.js');
const Procedure = require('./procedure.js');


// pages:
let Pages = {
  VNA:        'Connect to VNA',
  OSP:        'Connect to switch matrix',
  CHOOSE_PROCEDURE: 'Choose procedure',
  CHOOSE_CAL: 'Choose calibration',
  CALIBRATE:  'Calibrate',
  MEASURE:    'Measure'
};

class Controller {
  constructor(model=null, view=null) {
    this.model = model;
    this.view  = view;
    this.index = new PageIndex();
    this.restart();
  }
  restart() {
    this.index = new PageIndex(Pages.VNA, 0);
    this.history   = [];
  }
  back() {
    if (!this.history.length) {
      return;
    }
    this.index = this.history.pop();
    this.render();
  }
  next() {
    switch(this.index.page) {
      case Pages.VNA:
        this.processVna(this.view.vnaAddress);
        break;
      case Pages.OSP:
        this.processOsp(this.view.ospAddress);
        break;
      case Pages.CHOOSE_PROCEDURE:
        this.processProcedure(this.view.procedureFilename);
        break;
      case Pages.CHOOSE_CAL:
        this.processCalibrationChoice();
        break;
      case Pages.CALIBRATE:
        this.processCalibrationStep();
        break;
      case Pages.MEASURE:
        this.processMeasurementStep();
        break;
      default:
        return;
    }
  }

  render(params=Object.create(null)) {
    this.view.setPage(this.index, params)
  }

  processVna(address) {
    if (!address) {
      // TODO: Error message
      console.log('No VNA Address');
      return;
    }
    this.model.vnaAddress = address;
    if (!this.model.isVna()) {
      // TODO: Error message
      console.log('Could not connect to VNA');
      return;
    }
    this.pushCurrentIndexToHistory();
    this.index.page = Pages.OSP;
    this.render();
  }
  processOsp(address) {
    if (!address) {
      // TODO: Error message
      console.log('No OSP Address');
      return;
    }
    this.model.ospAddress = address;
    if (!this.model.isOsp()) {
      // TODO: Error message
      console.log('Could not connect to OSP');
      return;
    }
    this.pushCurrentIndexToHistory();
    this.index.page = Pages.CHOOSE_PROCEDURE;
    this.render();
  }
  processProcedure(filename) {
    if (!filename) {
      // TODO: Error message
      console.log('No procedure filename');
      return;
    }
    this.model.procedureFilename = filename;
    let procedure = this.model.getProcedure();
    let status = procedure.validate();
    if (!status.isValid) {
      // TODO: Display error message
      console.log(status.message);
      return;
    }
    this.pushCurrentIndexToHistory();
    this.index.page = Pages.CHOOSE_CAL;
    this.render();
  }
  processCalibrationChoice() {
    let choice = this.view.calibrationChoice;
    if (choice == 'no calibration') {
      this.skipCalibration();
    }
    else if (choice == 'use existing calibration') {
      this.useCalGroup(this.view.calGroup);
    }
    else {
      this.startCalibration();
    }
  }
  skipCalibration() {
    if (this.index.page != Pages.CHOOSE_CAL) {
      return;
    }
    this.model.calGroup = null;
    console.log("Skipping calibration...");
    this.pushCurrentIndexToHistory();
    this.model.calGroup = null;
    this.startMeasurements();
  }
  useCalGroup(name) {
    if (this.index.page != Pages.CHOOSE_CAL) {
      return;
    }
    // TODO
    this.model.calGroup = name
    console.log('Using saved cal');
    this.pushCurrentIndexToHistory();
    this.startMeasurements();
  }
  startCalibration() {
    if (this.index.page != Pages.CHOOSE_CAL) {
      return;
    }
    if (!this.model.isCalUnit()) {
      //TODO: Display error message
      console.log("No cal unit");
      return;
    }
    if (!this.model.startCalibration()) {
      // TODO: Display error message
      return;
    }
    this.pushCurrentIndexToHistory();
    this.index.page = Pages.CALIBRATE;
    this.index.step = 0;
    this.render();
  }
  processCalibrationStep() {
    if (!this.model.performCalibrationStep(this.index.step)) {
      // TODO: Handle error / message
      return;
    }

    this.index.step++;
    let steps = this.model.getProcedure().calibrationSteps;
    if (this.index.step >= steps.length) {
      // Finished, apply calibration
      // TODO: get cal name with
      // modal dialog? Separate page?
      let name = 'calibration'
      if (!this.model.applyCalibration()) {
        // TODO: Error message
        return;
      }
      if (!this.model.saveCalibration(name)) {
        // TODO: Error message
        return;
      }
      this.purgeCalibrationSteps();
      this.startMeasurements();
    }
    else {
      this.pushCurrentIndexToHistory();
      this.render();
    }
  }
  purgeCalibrationSteps() {
    for (let i = 0; i < this.history.length; i++) {
      const page = this.history[i].page;
      if (page == Pages.CALIBRATE) {
        this.history.splice(i, 1);
      }
    }
  }
  startMeasurements() {
    // TODO
    console.log('Starting measurements');
    this.pushCurrentIndexToHistory();
    this.index.page = Pages.MEASURE;
    this.index.step = 0;
    this.render();
  }
  processMeasurementStep() {
    if (!this.model.measure(this.index.step)) {
      // TODO: Handle error / message
      return;
    }

    let steps = this.model.getProcedure().steps;
    if (this.index.step + 1 >= steps.length) {
      console.log('Measurements complete!');
      // TODO: What do I do next?
      return;
    }

    this.pushCurrentIndexToHistory();
    this.index.step++;
    this.render();
  }

  pushCurrentIndexToHistory() {
    this.history.push(this.index.copy());
  }
}

module.exports = {
  Controller: Controller,
  Pages: Pages
}
