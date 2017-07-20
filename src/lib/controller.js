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
  async next() {
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
    catch (result) {
      console.log('Error in next');
      console.log(`code:   ${result.code}`);
      console.log(`stdout: '${result.stdout.text}'`);
      console.log(`stderr: '${result.stderr.text}'`);
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
    this.model.getProcedureFilename = inputs.procedureFilename;
    this.model.calChoice         = inputs.calChoice;
    this.model.calGroup          = inputs.calGroup;
  }
  async parameters() {
    const params = Object.create(null);
    params.vnaAddress        = this.model.vnaAddress;
    params.matrixAddress     = this.model.matrixAddress;
    params.procedureFilename = this.model.getProcedureFilename;
    params.calChoice         = this.model.calChoice;
    params.calGroup          = this.model.calGroup;
    params.index             = this.index;
    params.sidebar           = await this.summary();
    if (this.index.page == Pages.CHOOSE_CAL) {
      try {
        params.calGroups = await this.model.calGroups();
      }
      catch(result) {
        // TODO: Handle error?
        params.calGroups = [];
      }
    }
    else {
      params.calGroups = [];
    }
    if (this.index.page == Pages.CALIBRATE) {
      params.ports = await this.getCalPorts();
    }
    else if (this.index.page == Pages.MEASURE) {
      params.ports = this.getMeasurementPorts();
    }
    else {
      params.ports = [];
    }
    return params;
    // return {
    //   vnaAddress:        this.model.vnaAddress,
    //   matrixAddress:     this.model.matrixAddress,
    //   procedureFilename: this.model.getProcedureFilename,
    //   calChoice:         this.model.calChoice,
    //   calGroup:          this.model.calGroup,
    //   calGroups:         this.calGroups(),
    //   index:             this.index,
    //   ports:             ports,
    //   sidebar:           this.summary(),
    // };
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
    let pro = null;
    if (this.index.page == Pages.CALIBRATE) {
      try {
        pro = await this.model.getProcedure(true);
      }
      catch (result) {
        // TODO: Handle error
      }
    }
    if (!pro) {
      pro = await this.model.getProcedure();
    }
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
  async getCalPorts() {
    const isCalPage = this.index.page == Pages.CALIBRATE;
    if (!isCalPage) {
      return [-1];
    }
    const procedure = await this.model.getProcedure(true);
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

  async processSettings(params) {
    if (!params.vnaAddress) {
      // TODO: Error message
      console.log('No VNA address');
      return;
    }
    if (!params.matrixAddress) {
      // TODO: Error message
      console.log('No switch matrix address');
      return;
    }
    if (!params.procedureFilename) {
      // TODO: Error message
      console.log('No procedure filename');
      return;
    }
    try {
      await this.model.isVna();
      await this.model.isMatrix();
      let procedure = await this.model.getProcedure();
      let status = procedure.validate();
      if (!status.isValid) {
        // TODO: Display error message
        console.log(status.message);
        return;
      }
      this.pushCurrentIndexToHistory();
      this.index.page = Pages.CHOOSE_CAL;
      await this.render();
    }
    catch(result) {
      // TODO: Error message
      console.log('caught exception in processSettings');
      console.log(`stdout: '${result.stdout.text}'`);
    }
  }
  async processCalibrationChoice(params) {
    const choice = params.calChoice;
    if (!choice) {
      console.log('Choose calibration option');
      return;
    }
    if (choice == Choices.CALIBRATE) {
      await this.startCalibration();
    }
    else {
      await this.startMeasurements();
    }
  }
  async startCalibration() {
    let procedure;
    try {
      this.model.isCalUnit();
      this.model.startCalibration();
      procedure = await this.model.getProcedure(true);
    }
    catch (result) {
      // TODO: Display error
    }
    this.pushCurrentIndexToHistory();
    this.index.page = Pages.CALIBRATE;
    this.index.step = 0;
    this.index.totalSteps = procedure.calibrationSteps.length;
    await this.render();
  }
  async processCalibrationStep() {
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
  async startMeasurements() {
    // TODO
    this.pushCurrentIndexToHistory();
    this.index.page = Pages.MEASURE;
    this.index.step = 0;
    this.index.totalSteps = this.model.getProcedure().steps.length;
    this.render();
  }
  async processMeasurementStep() {
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
