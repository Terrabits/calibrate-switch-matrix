const {Choices} = require('./calibration.js');
const PageIndex = require('./page-index.js');
const Procedure = require('./procedure.js');


// pages:
let Pages = {
  SETTINGS:   'Settings',
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
    this.index = new PageIndex(Pages.SETTINGS, 0);
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
      case Pages.SETTINGS:
        let params = {
          'vna address': this.view.vnaAddress,
          'matrix address': this.view.matrixAddress,
          'procedure filename': this.view.procedureFilename
        };
        this.processSettings(params);
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

  processSettings(params) {
    if (!params['vna address']) {
      // TODO: Error message
      console.log('No VNA address');
      return;
    }
    this.model.vnaAddress = params['vna address'];
    if (!this.model.isVna()) {
      // TODO: Error message
      console.log('Could not connect to VNA');
      return;
    }
    if (!params['matrix address']) {
      // TODO: Error message
      console.log('No switch matrix address');
      return;
    }
    this.model.matrixAddress = params['matrix address'];
    if (!this.model.isMatrix()) {
      // TODO: Error message
      console.log('Could not connect to switch matrix');
      return;
    }
    if (!params['procedure filename']) {
      // TODO: Error message
      console.log('No procedure filename');
      return;
    }
    this.model.procedureFilename = params['procedure filename'];
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
    if (choice == Choices.NONE) {
      this.skipCalibration();
    }
    else if (choice == Choices.EXISTING) {
      this.useCalGroup(this.view.calGroup);
    }
    else if (choice = Choices.CALIBRATE) {
      this.startCalibration();
    }
    else {
      console.log('Choose calibration option');
      return;
    }
  }
  skipCalibration() {
    if (this.index.page != Pages.CHOOSE_CAL) {
      return;
    }
    console.log("Skipping calibration...");
    this.model.calGroup = null;
    this.pushCurrentIndexToHistory();
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
      this.view.calibrationChoice = Choices.EXISTING;
      this.view.calGroup          = name;
      this.model.calGroup         = name;
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
