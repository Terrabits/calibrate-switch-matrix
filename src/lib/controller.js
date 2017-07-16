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
  }
  restart() {
    this.index = new PageIndex(Pages.SETTINGS, 0);
    this.history   = [];
    this.render();
  }
  back() {
    if (!this.history.length) {
      return;
    }
    this.index = this.history.pop();
    this.render();
  }
  next() {
    this.updateModel();
    const params = this.parameters();
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
    if (this.view) {
      this.view.renderNewParameters(this.parameters());
    }
  }
  updateModel() {
    const inputs = this.getInputs();
    this.model.vnaAddress        = inputs.vnaAddress;
    this.model.matrixAddress     = inputs.matrixAddress;
    this.model.procedureFilename = inputs.procedureFilename;
    this.model.calChoice          = inputs.calChoice;
    this.model.calGroup          = inputs.calGroup;
  }
  parameters() {
    let ports = [];
    if (this.index.page == Pages.CALIBRATE) {
      ports = this.getCalPorts();
    }
    else if (this.index.page == Pages.MEASURE) {
      ports = this.getMeasurementPorts();
    }
    return {
      vnaAddress:        this.model.vnaAddress,
      matrixAddress:     this.model.matrixAddress,
      procedureFilename: this.model.procedureFilename,
      calChoice:         this.model.calChoice,
      calGroup:          this.model.calGroup,
      calGroups:         this.calGroups(),
      index:             this.index,
      ports:             ports,
      sidebar:           this.summary(),
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
  calGroups() {
    if (this.index.page != Pages.SETTINGS) {
      return this.model.calGroups();
    }
    else {
      return [];
    }
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
    if (this.index.page == Pages.SETTINGS) {
      settings.underline = true;
    }
    else {
      // Have procedure, display measurement steps
      measure.items = [];
      for (let i = 0; i < pro.steps.length; i++) {
        const step = pro.steps[i];
        measure.items.push({
          name: step.name,
          active: this.index.page == Pages.MEASURE? this.index.step == i : false
        });
      }
    }
    if (this.index.page == Pages.CHOOSE_CAL) {
      calibrate.underline = true;
    }
    if (this.index.page == Pages.CALIBRATE) {
      // display calibration steps
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
  getCalPorts() {
    const isCalPage = this.index.page == Pages.CALIBRATE;
    if (!isCalPage) {
      return [-1];
    }
    const procedure = this.model.getProcedure();
    return procedure.calibrationSteps[this.index.step];
  }
  getMeasurementPorts() {
    const isMeasurePage = this.index.page == Pages.MEASURE;
    if (!isMeasurePage) {
      return {};
    }
    const steps = this.model.getProcedure().steps;
    return steps[this.index.step]['vna connections'];
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
    if (!choice) {
      console.log('Choose calibration option');
      return;
    }
    if (choice == Choices.CALIBRATE) {
      this.startCalibration();
    }
    else {
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
    this.index.totalSteps = this.model.getProcedure().calibrationSteps.length;
    this.render();
  }
  processCalibrationStep() {
    // run step
    if (!this.model.performCalibrationStep(this.index.step)) {
      // TODO: Handle error / message
      console.log('calibration step failed')
      return;
    }
    this.pushCurrentIndexToHistory();

    // next
    this.index.step++;
    const steps = this.model.getProcedure().calibrationSteps;
    if (this.index.step >= steps.length) {
      if (!this.model.applyCalibration()) {
        // TODO: Error message
        console.log('Error applying calibration');
        return;
      }
      // TODO: Finish dialog
      const name = this.view.getSaveCalFromDialog();
      if (!name) {
        console.log('Save cancelled. No calibration?');
        return;
      }
      if (!this.model.saveCalibration(name)) {
        // TODO: Error message
        console.log('Error saving calibration');
        return;
      }
      this.purgeCalibrationSteps();
      this.model.calChoice       = Choices.EXISTING;
      this.model.calGroup        = name;
      this.startMeasurements();
    }
    else {
      this.render();
    }
  }
  purgeCalibrationSteps() {
    for (let i = this.history.length-1; i >= 0; i--) {
      const page = this.history[i].page;
      console.log(`${i+1}/${this.history.length}: ${page}`)
      if (page == Pages.CALIBRATE) {
        console.log('purging...');
        this.history.splice(i);
      }
    }
    this.index = this.history.pop();
  }
  startMeasurements() {
    // TODO
    this.pushCurrentIndexToHistory();
    this.index.page = Pages.MEASURE;
    this.index.step = 0;
    this.index.totalSteps = this.model.getProcedure().steps.length;
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
