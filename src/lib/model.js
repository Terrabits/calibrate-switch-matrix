const {Choices} = require('./calibration.js');
const Procedure = require('./procedure.js');
const python    = require('./python.js');
const Store     = require('electron-store');


class Model {
  constructor() {
    this.store = new Store();
  }

  // User settings
  get vnaAddress() {
    return this.store.get('vna-address', 'localhost');
  }
  set vnaAddress(addr) {
    this.store.set('vna-address', addr);
  }
  get matrixAddress() {
    return this.store.get('matrix-address', '1.2.3.4');
  }
  set matrixAddress(addr) {
    this.store.set('matrix-address', addr);
  }
  get procedureFilename() {
    return this.store.get('procedure-filename', '');
  }
  set procedureFilename(filename) {
    this.store.set('procedure-filename', filename);
  }
  get calChoice() {
    return this.store.get('cal-choice', Choices.CALIBRATE);
  }
  set calChoice(choice) {
    this.store.set('cal-choice', choice);
  }
  get calGroup() {
    return this.store.get('cal-group', 'cal group 1');
  }
  set calGroup(name) {
    this.store.set('cal-group', name);
  }

  // procedure
  getProcedure() {
    return new Procedure(this.procedureFilename, this.calUnitPorts());
  }

  // switch matrix
  isMatrix() {
    let args = [
      '--is-matrix',
      '--matrix-address', this.matrixAddress
    ];
    // TODO: check for matrix
    // let result = python.startSync(args);
    // if (!result.status) {
    //   // TODO: Error message
    //   return false;
    // }
    // return result.stdout.trim().toLowerCase() == 'true'
    return true;
  }

  // vna
  isVna() {
    let args = [
      '--is-vna',
      '--vna-address', this.vnaAddress
    ];
    // TODO: check for vna
    // let result = python.startSync(args);
    // if (!result.status) {
    //   // TODO: Error message
    //   return false;
    // }
    // return result.stdout.trim().toLowerCase() == 'true'
    return true;
  }
  calGroups() {
    return [
      'cal group 1',
      'cal group 2',
      'cal group 3',
      'cal group 4'
    ];
  }
  isCalUnit() {
    let args = [
      '--is-cal-unit',
      '--vna-address', this.vnaAddress
    ];
    // TODO: check for cal unit
    // let result = python.startSync(args);
    // if (!result.status) {
    //   // TODO: Error Message
    //   return false;
    // }
    // return result.stdout.trim().toLowerCase() == 'true'
    return true;
  }
  calUnitPorts() {
    let args = [
      '--cal-unit-ports',
      '--vna-address', this.vnaAddress
    ];
    // TODO: check cal unit ports
    // let result = python.startSync(args);
    // if (!result.status) {
    //   // TODO: Error message
    //   return -1;
    // }
    // return Number(result.stdout)
    return 2;
  }
  startCalibration() {
    let args = [
      '--start-calibration',
      '--vna-address', this.vnaAddress
    ];
    // TODO: start calibration
    // let result = python.startSync(args);
    // if (!result.status) {
    //   // TODO: Error message?
    //   return false;
    // }
    return true;
  }
  performCalibrationStep(i) {
    let args = [
      '--perform-calibration',
      '--step',        i,
      '--vna-address', this.vnaAddress
    ];
    // TODO: Perform calibration step
    // let result = python.startSync(args);
    // if (!result.status) {
    //   // TODO: Error message?
    //   return false;
    // }
    return true;
  }
  applyCalibration() {
    let args = [
      '--apply-calibration',
      '--vna-address', this.vnaAddress
    ];
    // TODO: Apply calibration
    // let result = python.startSync(args);
    // if (!result.status) {
    //   // TODO: Error message?
    //   return false;
    // }
    return true;
  }
  saveCalibration(name) {
    let args = [
      '--save-calibration',
      '--vna-cal-group', name,
      '--vna-address',   this.vnaAddress
    ];
    // TODO: save calibration
    // let result = python.startSync(args);
    // if (!result.status) {
    //   // TODO: Error message?
    //   return false;
    // }
    this.calGroup = name;
    return true;
  }
  measure(i) {
    let args = [
      '--measure',
      '--step',          i,
      '--vna-address',   this.vnaAddress,
      '--vna-cal-group', this.calGroup,
      '--matrix-address',   this.matrixAddress
    ];
    // TODO: Perform measurement
    // let result = python.startSync(args);
    // if (!result.status) {
    //   // TODO: Error message?
    //   return false;
    // }
    return true;
  }
}

module.exports = Model;
