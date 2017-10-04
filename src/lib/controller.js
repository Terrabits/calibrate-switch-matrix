const {Choices} = require('./calibration.js');
const {PageIndex, Pages} = require('./page-index.js');

function getVnaPorts(step) {
  const vnaPorts = [];
  for (i of step) {
    vnaPorts.push(i[0]);
  }
  return vnaPorts;
}

class Controller {
  constructor(model, view) {
    this.index = new PageIndex();
    this.model = model;
    this.view  = view;
    this.restart();
  }

  // user actions
  async restart() {
    winston.debug('controller.restart');
    if (this.index.isCalibrationPage()) {
      this.view.alert.showMessage('danger', 'Calibration aborted');
    }
    else {
      this.view.alert.clear();
    }
    this.index.restart();
    await this.render();
    this.enableInputs();
  }
  async back() {
    winston.debug('controller.back', {index: this.index});
    if (this.index.isSettingsPage()) {
      return;
    }
    this.disableInputs();
    this.displayOverlay();
    this.view.alert.clear();
    if (this.index.isChooseCalPage()) {
      this.updateModel();
    }
    this.index.back();
    await this.render();
    this.hideOverlay();
    this.enableInputs();
  }
  async next() {
    winston.debug('controller.next', {index: this.index});
    this.disableInputs();
    this.displayOverlay();
    this.view.alert.clear();
    this.updateModel();
    try {
      const params = await this.parameters();
      switch(this.index.page) {
        case Pages.SETTINGS:
          await this.processSettings(params);
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
      winston.error('Exception caught in controller.next', err);
      if (err) {
        if (err.message) {
          this.view.alert.showMessage('danger', String(err.message));
        }
        else if (err.stdout && err.stdout.text) {
          this.view.alert.showMessage('danger', err.stdout.text);
        }
        else if (err.stderr && err.stderr.text) {
          this.view.alert.showMessage('danger', err.stderr.text);
        }
        else {
          this.view.alert.showMessage('danger', JSON.stringify(err));
        }
      }
      else {
        this.view.alert.showMessage('danger', 'Unknown error occurred. See logs for details.');
      }
    }
    this.hideOverlay();
    this.enableInputs();
  }
  setIndex(i) {
    if (i.isSettingsPage()) {
      this.restart();
      return;
    }
    if (this.index.isSettingsPage()) {
      this.view.alert.showMessage('danger', 'Complete settings and click next to continue.');
      return;
    }
    if (this.index.isChooseCalPage() && !i.isChooseCalPage()) {
      this.view.alert.showMessage('danger', 'Choose calibration and click next to continue.');
      return;
    }
    if (this.index.isCalibrationPage() && !i.isCalibrationPage()) {
      this.view.alert.showMessage('danger', 'Calibration aborted');
    }
    this.index.page = i.page;
    this.index.step = i.step;
    this.render();
  }

  // model/view control
  async render() {
    let params = await this.parameters();
    winston.debug('controller.render', {params});
    await this.view.renderNewParameters(params);
  }
  updateModel() {
    winston.debug('controller.updateModel');
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
    if (this.index.isChooseCalPage()) {
        params.calGroups = await this.model.calGroups();
        if (params.calGroups.length) {
          let lowercase = (i) => { return String(i).toLowerCase(); };
          let isCalGroup = params.calGroups.map(lowercase).includes(params.calGroup.toLowerCase());
          if (!isCalGroup) {
            params.calGroup = params.calGroups[0];
          }
        }
        else {
          params.calGroup = '';
          if (params.calChoice == Choices.EXISTING) {
            params.calChoice = Choices.CALIBRATE;
          }
        }
    }
    else {
      params.calGroups = [];
    }
    if (this.index.isCalibrationPage()) {
      params.ports = await this.getCalPorts();
    }
    else if (this.index.isMeasurementPage()) {
      params.ports = await this.getMeasurementPorts();
    }
    else {
      params.ports = [];
    }
    params.changeIndex = (i) => {
      this.setIndex(i);
    }
    return params;
  }
  getInputs() {
    const inputs = this.view.getUserInputs();
    winston.debug('controller.inputs', {inputs});
    return {
      vnaAddress:        inputs.vnaAddress,
      matrixAddress:     inputs.matrixAddress,
      procedureFilename: inputs.procedureFilename,
      calChoice:         inputs.calChoice,
      calGroup:          inputs.calGroup
    };
  }
  disableInputs(value=true) {
    this.view.disableInputs = value;
  }
  enableInputs(value=true) {
    this.disableInputs(!value);
  }
  displayOverlay(value=true) {
    this.view.displayOverlay = value;
  }
  hideOverlay(value=true) {
    this.displayOverlay(!value);
  }
  async summary() {
    let settings  = {
      name: 'Settings',
      index: new PageIndex(Pages.SETTINGS),
      active: this.index.isSettingsPage()
    };
    let calibrate = {
      name: 'Calibrate',
      index: new PageIndex(Pages.CHOOSE_CAL),
      active: this.index.isChooseCalPage()
    };
    let measure   = {
      name: 'Measure',
      index: new PageIndex(Pages.MEASURE),
      active: false
    };
    if (this.index.isSettingsPage()) {
      return [settings, calibrate, measure];
    }

    // Get procedure
    let procedure = null;
    if (this.index.isCalibrationPage()) {
      procedure = await this.model.getProcedure(true);
    }
    else {
      procedure = await this.model.getProcedure();
    }
    if (!procedure.status.isValid) {
      return [settings, calibrate, measure];
    }

    // Calibrate
    if (this.index.isCalibrationPage()) {
      const items = [];
      const steps = procedure.calibrationSteps;
      const STEPS = steps.length;
      for (let i = 0; i < STEPS; i++) {
        const vnaPorts = getVnaPorts(steps[i]);
        items.push({
          name:   `Ports ${vnaPorts.join(', ')}`,
          index:  new PageIndex(Pages.CALIBRATE, i),
          active: this.index.step == i
        });
      }
      calibrate.items = items;
    }
    // Measure
    if (!this.index.isSettingsPage()) {
      measure.items = [];
      for (let i = 0; i < procedure.steps.length; i++) {
        const step = procedure.steps[i];
        measure.items.push({
          name:   step.name,
          index:  new PageIndex(Pages.MEASURE, i),
          active: this.index.isMeasurementPage() && this.index.step == i
        });
      }
    }
    return [settings, calibrate ,measure];
  }
  async getCalPorts() {
    if (!this.index.isCalibrationPage()) {
      return [-1];
    }
    const procedure = await this.model.getProcedure(true);
    return procedure.calibrationSteps[this.index.step];
  }
  async getMeasurementPorts() {
    if (!this.index.isMeasurementPage()) {
      return {};
    }
    const procedure = await this.model.getProcedure();
    const steps     = procedure.steps;
    return steps[this.index.step]['vna connections'];
  }

  // process action
  async processSettings(params) {
    winston.debug('controller.processSettings', {index: this.index, params});
    if (!this.model.vnaAddress) {
      throw new Error('VNA address missing');
    }
    if (!this.model.matrixAddress) {
      throw new Error('Switch matrix address missing');
    }
    if (!this.model.procedureFilename) {
      throw new Error('Procedure filename is missing');
    }
    await this.model.isVna();
    await this.model.isMatrix();
    const procedure = await this.model.getProcedure();
    if (!procedure.status.isValid) {
      throw new Error(procedure.status.message);
    }
    this.index.measurementSteps = procedure.steps.length;
    this.index.next();
    await this.render();
  }
  async processCalibrationChoice(params) {
    winston.debug('controller.processCalibrationChoice', {index: this.index, params});
    const choice = params.calChoice;
    if (!choice) {
      throw new Error('Choose calibration option');
    }
    if (choice == Choices.CALIBRATE) {
      await this.startCalibration();
    }
    else {
      await this.startMeasurements();
    }
  }
  async startCalibration() {
    winston.debug('controller.startCalibration', {index: this.index});
    await this.model.isCalUnit();
    this.index.startCalibration();
    const procedure = await this.model.getProcedure(true);
    this.index.calibrationSteps = procedure.calibrationSteps.length;
    await this.render();
    await this.model.startCalibration();
  }
  async processCalibrationStep() {
    winston.debug('controller.processCalibrationStep', {index: this.index});
    await this.model.performCalibrationStep(this.index.step);
    if (this.index.isLastStep()) {
      await this.model.applyCalibration();
      // TODO: Finish save dialog
      // const name = this.view.getSaveCalFromDialog();
      const name = 'calibrate switch matrix';
      if (name) {
        await this.model.saveCalibration(name);
        this.model.calChoice = Choices.EXISTING;
        this.model.calGroup  = name;
        await this.startMeasurements();
      }
      this.view.alert.showMessage('success', 'Calibration complete!');
    }
    else {
      const step  = this.index.step+1;
      const steps = this.index.calibrationSteps;
      this.index.next();
      await this.render();
      this.view.alert.showMessage('success', `Calibration step ${step}/${steps} complete!`);
    }
  }
  async startMeasurements() {
    winston.debug('controller.startMeasurements', {index: this.index});
    this.index.startMeasurement();
    const procedure = await this.model.getProcedure();
    this.index.measurementSteps = procedure.steps.length;
    await this.render();
  }
  async processMeasurementStep() {
    winston.debug('controller.processMeasurementStep', {index: this.index});
    await this.model.measure(this.index.step);
    if (!this.index.isLastStep()) {
      const step  = this.index.step+1;
      const steps = this.index.measurementSteps;
      this.view.alert.showMessage('success', `Measurement Step ${step}/${steps} complete!`);
    }
    this.index.next();
    await this.render();
  }
}

module.exports = Controller;
