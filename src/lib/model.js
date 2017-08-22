const python      = require('./python.js');
const Store       = require('electron-store');
const path        = require('path');


class Model {
  constructor(store) {
    this.store = new Store();
    let logPath    = path.resolve(this.store.path, '../');
    this.matrixLog = path.resolve(logPath,         'matrix scpi log.txt');
  }
  // User settings
  get matrixAddress() {
    const value = this.store.get('matrix-address', '');
    winston.debug('model.matrixAddress', {value});
    return value;
  }
  set matrixAddress(addr) {
    winston.debug('model.matrixAddress=', {value: addr});
    this.store.set('matrix-address', addr);
  }
  get pathFilename() {
    const value = this.store.get('path-filename', '');
    winston.debug('model.pathFilename', {value});
    return value;
  }
  set pathFilename(filename) {
    winston.debug('model.pathFilename=', {value: filename});
    this.store.set('path-filename', filename);
  }

  // switch matrix
  setSwitches() {
    winston.debug('model.setSwitches');
    const args = [
      '--matrix-address', this.matrixAddress,
      '--matrix-log',     this.matrixLog,
      '--path',           this.pathFilename
    ];
    return python.start(args);
  }
}

module.exports = Model;
