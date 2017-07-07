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
    this.index = new PageIndex(Pages.SETTINGS);
    this.restart();
    this.render();
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
    this.updateModelWithInputs();
    const params = this.getSettingsFromModel();
    switch(this.index.page) {
      case Pages.SETTINGS:
        this.processSettings(params);
        break;
      case Pages.CHOOSE_PROCEDURE:
        this.processProcedure(params);
        break;
      case Pages.CHOOSE_CAL:
        this.processCalibrationChoice(params);
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

  render() {
    this.view.renderNewParameters(this.getSettingsFromModel());
  }
  updateModelWithInputs() {
    const inputs = this.getInputs();
    this.model.vnaAddress        = inputs.vnaAddress;
    this.model.matrixAddress     = inputs.matrixAddress;
    this.model.procedureFilename = inputs.procedureFilename;
    this.model.calChoie          = inputs.calChoice;
    this.model.calGroup          = inputs.calGroup;
  }
  getSettingsFromModel() {
    return {
      vnaAddress:        this.model.vnaAddress,
      matrixAddress:     this.model.matrixAddress,
      procedureFilename: this.model.procedureFilename,
      calChoice:         this.model.calChoice,
      calGroup:          this.model.calGroup,
      index:             this.index,
      sidebar:           this.summary()
    };
  }
  getInputs() {
    const inputs = this.view.getUserInputs();
    return {
      vnaAddress:        inputs.vnaAddress,
      matrixAddress:     inputs.matrixAddress,
      procedureFilename: inputs.procedureFilename,
      calChoice:         inputs.calChoice,
      calGroup:          inputs.calGroup
    };
  }
  summary() {
    const pro = this.model.getProcedure();
    let settings  = {name: 'Settings'};
    let calibrate = {name: 'Calibrate'};
    let measure   = {name: 'Measure'};
    if (!pro.isValid) {
      return [
        settings,
        calibrate,
        measure
      ];
    }
    if (this.index.page != Pages.SETTINGS) {
      measure.items = [];
      for (let i = 0; i < pro.steps.length; i++) {
        const step = pro.steps[i];
        measure.items.push({
          name: step.name,
          active: this.index.page == Pages.MEASURE? this.index.step == i : false
        });
      }
    }
    if (this.index.page == Pages.CALIBRATE) {
      calibrate.items = [];
      const steps = pro.calibrationSteps;
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        calibrate.items.push({
          name: `Ports ${step}`,
          active: this.index.step == i
        });
      }
    }
    return [
      settings,
      calibrate,
      measure
    ];
  }

  processSettings(params) {
    if (!params.vnaAddress) {
      // TODO: Error message
      console.log('No VNA address');
      return;
    }
    if (!this.model.isVna()) {
      // TODO: Error message
      console.log('Could not connect to VNA');
      return;
    }
    if (!params.matrixAddress) {
      // TODO: Error message
      console.log('No switch matrix address');
      return;
    }
    if (!this.model.isMatrix()) {
      // TODO: Error message
      console.log('Could not connect to switch matrix');
      return;
    }
    if (!params.procedureFilename) {
      // TODO: Error message
      console.log('No procedure filename');
      return;
    }
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
  processCalibrationChoice(params) {
    const choice = params.calChoice;
    console.log('processing calibration choice: ' + choice);
    if (!choice) {
      console.log('Choose calibration option');
      return;
    }
    if (choice == Choices.CALIBRATE) {
      this.startCalibration();
    }
    else {
      this.pushCurrentIndexToHistory();
      this.startMeasurements();
    }
  }
  startCalibration() {
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
      console.log('calibration step failed')
      return;
    }

    this.index.step++;
    let steps = this.model.getProcedure().calibrationSteps;
    if (this.index.step >= steps.length) {
      // Finished, apply calibration
      // TODO: get cal name with
      // modal dialog? Separate page?
      if (!this.model.applyCalibration()) {
        // TODO: Error message
        console.log('Error applying calibration');
        return;
      }
      const name = this.view.getSaveCalFromDialog();
      if (!name) {
        console.log('Save canceled. No calibration?');
        return;
      }
      if (!this.model.saveCalibration(name)) {
        // TODO: Error message
        console.log('Error saving calibration');
        return;
      }
      this.purgeCalibrationSteps();
      this.view.wizard.calChoice = Choices.EXISTING;
      this.view.wizard.calGroup          = name;
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
