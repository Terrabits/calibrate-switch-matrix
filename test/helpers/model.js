const Procedure = require('../../src/lib/procedure.js');
const {Choices} = require('../../src/lib/calibration.js');

class Model {
  constructor() {
    this.vnaAddress        = '192.168.1.100';
    this.matrixAddress     = '192.168.1.101';
    this.procedureFilename = '';
    this.calChoice         = Choices.NONE;
    this.calGroup          = '';
    this.state = {
      isVna:                  true,
      isMatrix:               true,
      isProcedure:            true,
      calGroups:                [],
      isCalUnit:              true,
      calUnitPorts:              2,
      startCalibration:       true,
      performCalibrationStep: true,
      applyCalibration:       true,
      saveCalibration:        true,
      measure:                true
    };
  }

  async isVna() {
    return this.state.isVna;
  }
  async isMatrix() {
    return this.state.isMatrix;
  }

  async getProcedure(fetchCalUnitPorts=false) {
    if (!fetchCalUnitPorts) {
      return new Procedure(this.procedureFilename, 0);
    }
    else {
      return new Procedure(this.procedureFilename, await this.calUnitPorts());
    }
  }

  async calGroups() {
    return this.state.calGroups;
  }

  async isCalUnit() {
    if (this.state.isCalUnit) {
      return true;
    }
    else {
      throw new Error('is cal unit failed');
    }
  }
  async calUnitPorts() {
    if (this.state.isCalUnit) {
      return this.state.calUnitPorts;
    }
    else {
      throw new Error('cal unit ports failed');
    }
  }
  async startCalibration() {
    if (this.state.startCalibration) {
      return true;
    }
    else {
      throw new Error('start calibration failed');
    }
  }
  async performCalibrationStep(i) {
    if (this.state.performCalibrationStep) {
      return true
    }
    else {
      throw new Error(`calibration step ${i} failed`);
    }
  }
  async applyCalibration() {
    if (this.state.applyCalibration) {
      return true;
    }
    else {
      throw new Error('apply calibration failed');
    }
  }
  async saveCalibration(name) {
    if (this.state.saveCalibration) {
      this.calGroup = name;
      return true;
    }
    else {
      throw new Error('save calibration failed');
    }
  }
  async measure(i) {
    if (this.state.measure) {
      return true;
    }
    else {
      throw new Error(`measure step ${i} failed`);
    }
  }
}

module.exports = Model;
