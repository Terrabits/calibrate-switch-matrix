const {Choices}   = require('./calibration.js');
const Procedure   = require('./procedure.js');
const python      = require('./python.js');
const Store       = require('electron-store');


class Model {
  constructor(store) {
    this.store = new Store();
  }
  // User settings
  get vnaAddress() {
    return this.store.get('vna-address', '');
  }
  set vnaAddress(addr) {
    this.store.set('vna-address', addr);
  }
  get matrixAddress() {
    return this.store.get('matrix-address', '');
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
    return this.store.get('cal-group', '');
  }
  set calGroup(name) {
    this.store.set('cal-group', name);
  }

  // procedure
  getProcedure(fetchCalUnitPorts=false) {
    if (!fetchCalUnitPorts) {
      return new Procedure(this.procedureFilename, 0);
    }

    let calUnitPorts;
    return (async () => {
      try {
        calUnitPorts = await this.calUnitPorts();
        return new Procedure(this.procedureFilename, calUnitPorts);
      }
      catch (result) {
        return new Procedure(this.procedureFilename, 0);
      }
    })();
  }

  // switch matrix
  isMatrix() {
    const args = [
      '--is-matrix',
      '--matrix-address', this.matrixAddress
    ];
    return python.start(args).then((result) => {
      return true;
    });
  }

  // vna
  isVna() {
    const args = [
      '--is-vna',
      '--vna-address', this.vnaAddress
    ];
    return python.start(args).then((result) => {
      return true;
    });
  }
  calGroups() {
    let args = [
      '--cal-groups',
      '--vna-address', this.vnaAddress
    ];
    return python.start(args).then((result) => {
      return result.trim().split(',');
    });
  }
  isCalUnit() {
    let args = [
      '--is-cal-unit',
      '--vna-address', this.vnaAddress
    ];
    return python.start(args).then((result) => {
      return true;
    });
  }
  calUnitPorts() {
    let args = [
      '--cal-unit-ports',
      '--vna-address', this.vnaAddress
    ];
    return python.start(args).then((result) => {
      return Number(result.trim());
    });
  }
  startCalibration() {
    let args = [
      '--start-calibration',
      '--vna-address', this.vnaAddress,
      '--procedure',   this.procedureFilename
    ];
    return python.start(args).then((result) => {
      return true;
    });
  }
  performCalibrationStep(i) {
    let args = [
      '--perform-calibration',
      '--vna-address', this.vnaAddress,
      '--procedure',   this.procedureFilename,
      '--step',        i
    ];
    return python.start(args).then((result) => {
      return true;
    });
  }
  applyCalibration() {
    let args = [
      '--apply-calibration',
      '--vna-address', this.vnaAddress
    ];
    return python.start(args).then((result) => {
      return true;
    });
  }
  saveCalibration(name) {
    let args = [
      '--save-calibration',
      '--vna-address',   this.vnaAddress,
      '--cal-group', name
    ];
    return python.start(args).then((result) => {
      this.calGroup = name;
      return true;
    });
  }
  measure(i) {
    let args = [
      '--measure',
      '--vna-address',    this.vnaAddress,
      '--matrix-address', this.matrixAddress,
      '--procedure',      this.procedureFilename,
      '--step',           i
    ];
    if (this.calChoice == Choices.EXISTING) {
      args.push('--cal-group');
      args.push(this.calGroup);
    }
    return python.start(args).then((result) => {
      return true;
    });
  }
}

module.exports = Model;
