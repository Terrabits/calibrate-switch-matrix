const {Choices}   = require('./calibration.js');
const Procedure   = require('./procedure.js');
const python      = require('./python.js');
const Store       = require('electron-store');
const path        = require('path');


class Model {
  constructor(store) {
    this.store = new Store();
    let logPath    = path.resolve(this.store.path, '../');
    this.vnaLog    = path.resolve(logPath,         'vna scpi log.txt'   );
    this.matrixLog = path.resolve(logPath,         'matrix scpi log.txt');
  }
  // User settings
  get vnaAddress() {
    const value = this.store.get('vna-address', '');
    winston.debug('model.vnaAddress', {value});
    return value;
  }
  set vnaAddress(addr) {
    winston.debug('model.vnaAddress=', {value: addr});
    this.store.set('vna-address', addr);
  }
  get matrixAddress() {
    const value = this.store.get('matrix-address', '');
    winston.debug('model.matrixAddress', {value});
    return value;
  }
  set matrixAddress(addr) {
    winston.debug('model.matrixAddress=', {value: addr});
    this.store.set('matrix-address', addr);
  }
  get procedureFilename() {
    const value = this.store.get('procedure-filename', '');
    winston.debug('model.procedureFilename', {value});
    return value;
  }
  set procedureFilename(filename) {
    winston.debug('model.procedureFilename=', {value: filename});
    this.store.set('procedure-filename', filename);
  }
  get calChoice() {
    const value = this.store.get('cal-choice', '');
    winston.debug('model.calChoice', {value});
    return value;
  }
  set calChoice(choice) {
    winston.debug('model.calChoice=', {value: choice});
    this.store.set('cal-choice', choice);
  }
  get calGroup() {
    const value = this.store.get('cal-group', '');
    winston.debug('model.calGroup', {value});
    return value;
  }
  set calGroup(name) {
    winston.debug('model.calGroup=', {value: name});
    this.store.set('cal-group', name);
  }

  // procedure
  getProcedure(fetchCalUnitPorts=false) {
    winston.debug('model.getProcedure');
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
    winston.debug('model.isMatrix');
    const args = [
      '--is-matrix',
      '--matrix-address', this.matrixAddress,
      '--matrix-log',     this.matrixLog
    ];
    return python.start(args).then((result) => {
      return true;
    });
  }

  // vna
  isVna() {
    winston.debug('model.isVna');
    const args = [
      '--is-vna',
      '--vna-address', this.vnaAddress,
      '--vna-log',     this.vnaLog
    ];
    return python.start(args).then((result) => {
      return true;
    });
  }
  calGroups() {
    winston.debug('model.calGroups');
    let args = [
      '--cal-groups',
      '--vna-address', this.vnaAddress,
      '--vna-log',     this.vnaLog
    ];
    return python.start(args).then((result) => {
      return result.trim().split(',');
    });
  }
  isCalUnit() {
    winston.debug('model.isCalUnit');
    let args = [
      '--is-cal-unit',
      '--vna-address', this.vnaAddress,
      '--vna-log',     this.vnaLog
    ];
    return python.start(args).then((result) => {
      return true;
    });
  }
  calUnitPorts() {
    winston.debug('model.calUnitPorts');
    let args = [
      '--cal-unit-ports',
      '--vna-address', this.vnaAddress,
      '--vna-log',     this.vnaLog
    ];
    return python.start(args).then((result) => {
      return Number(result.trim());
    });
  }
  startCalibration() {
    winston.debug('model.startCalibration');
    let args = [
      '--start-calibration',
      '--vna-address', this.vnaAddress,
      '--vna-log',     this.vnaLog,
      '--procedure',   this.procedureFilename
    ];
    return python.start(args).then((result) => {
      return true;
    });
  }
  performCalibrationStep(i) {
    winston.debug('model.performCalibrationStep', {i});
    let args = [
      '--perform-calibration',
      '--vna-address', this.vnaAddress,
      '--vna-log',     this.vnaLog,
      '--procedure',   this.procedureFilename,
      '--step',        i
    ];
    return python.start(args).then((result) => {
      return true;
    });
  }
  applyCalibration() {
    winston.debug('model.applyCalibration');
    let args = [
      '--apply-calibration',
      '--vna-address', this.vnaAddress,
      '--vna-log',     this.vnaLog
    ];
    return python.start(args).then((result) => {
      return true;
    });
  }
  saveCalibration(name) {
    winston.debug('model.saveCalibration', {name});
    let args = [
      '--save-calibration',
      '--vna-address', this.vnaAddress,
      '--vna-log',     this.vnaLog,
      '--cal-group',   name
    ];
    return python.start(args).then((result) => {
      this.calGroup = name;
      return true;
    });
  }
  measure(i) {
    winston.debug('model.measure', {i});
    let args = [
      '--measure',
      '--vna-address',    this.vnaAddress,
      '--vna-log',        this.vnaLog,
      '--matrix-address', this.matrixAddress,
      '--matrix-log',     this.matrixLog,
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
