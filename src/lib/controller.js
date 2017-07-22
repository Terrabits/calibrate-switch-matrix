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
  async restart() {
    this.index = new PageIndex(Pages.SETTINGS, 0);
    this.history   = [];
    await this.render();
  }
  async back() {
    if (!this.history.length) {
      return;
    }
    this.index = this.history.pop();
    await this.render();
  }
  async next() {
    this.view.alert.clear();
    this.updateModel();
    try {
      const params = await this.parameters();
      switch(this.index.page) {
        case Pages.SETTINGS:
          await this.processSettings(params);
          break;
        case Pages.CHOOSE_PROCEDURE:
          await this.processProcedure(params);
          break;
        case Pages.CHOOSE_CAL:
          await this.processCalibrationChoice(params);
          break;
        case Pages.CALIBRATE:
          await this.processCalibrationStep();
          break;
        case Pages.MEASURE:
          await this.processMeasurementStep();
          break;
        default:
          return;
      }
    }
    catch (err) {
      this.view.alert.showMessage('danger', String(err));
    }
  }

  async render() {
    if (this.view) {
      await this.view.renderNewParameters(await this.parameters());
    }
  }
  updateModel() {
    const inputs = this.getInputs();
    this.model.vnaAddress        = inputs.vnaAddress;
    this.model.matrixAddress     = inputs.matrixAddress;
    this.model.procedureFilename = inputs.procedureFilename;
    this.model.calChoice         = inputs.calChoice;
    this.model.calGroup          = inputs.calGroup;
  }
  async parameters() {
    const params = Object.create(null);
    params.vnaAddress        = this.model.vnaAddress;
    params.matrixAddress     = this.model.matrixAddress;
    params.procedureFilename = this.model.procedureFilename;
    params.calChoice         = this.model.calChoice;
    params.calGroup          = this.model.calGroup;
    params.index             = this.index;
    params.sidebar           = await this.summary();
    if (this.index.page == Pages.CHOOSE_CAL) {
        params.calGroups = await this.model.calGroups();
    }
    else {
      params.calGroups = [];
    }
    if (this.index.page == Pages.CALIBRATE) {
      params.ports = await this.getCalPorts();
    }
    else if (this.index.page == Pages.MEASURE) {
      params.ports = await this.getMeasurementPorts();
    }
    else {
      params.ports = [];
    }
    return params;
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
  async summary() {
    let procedure = null;
    if (this.index.page == Pages.CALIBRATE) {
        procedure = await this.model.getProcedure(true);
    }
    else {
      procedure = await this.model.getProcedure();
    }
    let settings  = {name: 'Settings'};
    let calibrate = {name: 'Calibrate'};
    let measure   = {name: 'Measure'};
    if (!procedure || !procedure.isValid) {
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
      for (let i = 0; i < procedure.steps.length; i++) {
        const step = procedure.steps[i];
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
      const steps = procedure.calibrationSteps;
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
  async getCalPorts() {
    const isCalPage = this.index.page == Pages.CALIBRATE;
    if (!isCalPage) {
      return [-1];
    }
    const procedure = await this.model.getProcedure(true);
    return procedure.calibrationSteps[this.index.step];
  }
  async getMeasurementPorts() {
    const isMeasurePage = this.index.page == Pages.MEASURE;
    if (!isMeasurePage) {
      return {};
    }
    const procedure = await this.model.getProcedure();
    const steps     = procedure.steps;
    return steps[this.index.step]['vna connections'];
  }

  async processSettings(params) {
    if (!this.model.vnaAddress) {
      throw 'VNA address missing';
    }
    if (!this.model.matrixAddress) {
      throw 'Switch matrix address missing';
    }
    if (!this.model.procedureFilename) {
      throw 'Procedure filename is missing';
    }
    await this.model.isVna();
    await this.model.isMatrix();
    const procedure = await this.model.getProcedure();
    let status = procedure.validate();
    if (!status.isValid) {
      throw status.message;
    }
    this.pushCurrentIndexToHistory();
    this.index.page = Pages.CHOOSE_CAL;
    await this.render();
  }
  async processCalibrationChoice(params) {
    const choice = params.calChoice;
    if (!choice) {
      throw 'Choose calibration option';
    }
    if (choice == Choices.CALIBRATE) {
      await this.startCalibration();
    }
    else {
      await this.startMeasurements();
    }
  }
  async startCalibration() {
    this.model.isCalUnit();
    this.model.startCalibration();
    const procedure = await this.model.getProcedure(true);
    this.pushCurrentIndexToHistory();
    this.index.page = Pages.CALIBRATE;
    this.index.step = 0;
    this.index.totalSteps = procedure.calibrationSteps.length;
    await this.render();
  }
  async processCalibrationStep() {
    // run step
    await this.model.performCalibrationStep(this.index.step);
    this.pushCurrentIndexToHistory();

    // next
    this.index.step++;
    const procedure = await this.model.getProcedure();
    const steps     = procedure.calibrationSteps;
    if (this.index.step >= steps.length) {
      await this.model.applyCalibration();
      // TODO: Finish dialog
      const name = this.view.getSaveCalFromDialog();
      if (name) {
        await this.model.saveCalibration(name);
        this.purgeCalibrationSteps();
        this.model.calChoice = Choices.EXISTING;
        this.model.calGroup  = name;
        await this.startMeasurements();
      }
    }
    else {
      await this.render();
    }
  }
  purgeCalibrationSteps() {
    for (let i = this.history.length-1; i >= 0; i--) {
      const page = this.history[i].page;
      if (page == Pages.CALIBRATE) {
        this.history.splice(i);
      }
    }
    this.index = this.history.pop();
  }
  async startMeasurements() {
    this.pushCurrentIndexToHistory();
    this.index.page = Pages.MEASURE;
    this.index.step = 0;
    const procedure = await this.model.getProcedure();
    this.index.totalSteps = procedure.steps.length;
    await this.render();
  }
  async processMeasurementStep() {
    await this.model.measure(this.index.step);
    const procedure = await this.model.getProcedure();
    const steps     = procedure.steps;
    if (this.index.step + 1 >= steps.length) {
      this.view.alert.showMessage('success', 'Measurements complete!');
    }
    else {
      this.pushCurrentIndexToHistory();
      this.index.step++;
      await this.render();
    }
  }
  pushCurrentIndexToHistory() {
    this.history.push(this.index.copy());
  }
}

module.exports = {
  Controller: Controller,
  Pages: Pages
}
