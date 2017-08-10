const createSteps = require('./calibration.js').createSteps;
const yaml = require('js-yaml');
const fs   = require('fs');

class Procedure {
  constructor(filename='', calUnitPorts=0) {
    this.load(filename);
    this.calUnitPorts = calUnitPorts;
  }

  get steps() {
    return this.yaml['measurement steps'];
  }
  get calibrationSteps() {
    if (!this.calUnitPorts) {
      return [];
    }
    const ports = this.yaml['vna calibration']['ports'];
    return createSteps(ports, this.calUnitPorts);
  }

  validate() {
    if (!this.yaml) {
      return false;
    }

    let requiredProperties = ['name',
                              'switch matrix',
                              'vna calibration',
                              'measurement steps'
                             ];
    for (let i of requiredProperties) {
      if (!this.yaml.hasOwnProperty(i)) {
        this.status.message = `${i} missing in procedure`;
        return status;
      }
    }
    if (!this.yaml['measurement steps']) {
      this.status.message = `No measurement steps found`;
      return false;
    }
    if (!this.yaml['measurement steps'].length) {
      this.status.message = `No measurement steps found`;
      return status;
    }
    for (let step of this.yaml['measurement steps']) {
      requiredProperties = ['name',
                            'vna connections',
                            'measurements'
                           ];
      for (let i of requiredProperties) {
        if (!step.hasOwnProperty(i)) {
          this.status.message = `Measurement step(s) missing '${i}'`;
          return status;
        }
      }
      if (!Object.getOwnPropertyNames(step['vna connections']).length) {
        this.status.message = `Measurement step(s) missing vna connections`;
        return status;
      }
      if (!step['measurements'].length) {
        this.status.message = `No measurements in procedure`;
        return status;
      }
      for (let meas of step['measurements']) {
        if (!meas.hasOwnProperty('switch path')) {
          this.status.message = `Measurement step(s) missing switch path`;
          return status;
        }
        if (!meas.hasOwnProperty('vna setup')) {
          this.status.message = `Measurement step(s) missing vna setup`;
          return status;
        }
        if (!meas.hasOwnProperty('vna ports')) {
          this.status.message = `Measurement step(s) missing vna ports`;
          return status;
        }
        if (!meas['vna ports'].length) {
          this.status.message = `Measurement step(s) missing vna ports`;
          return status;
        }
      }
    }
    // Else
    this.status.isValid = true;
    this.status.message = '';
    return true;
  }

  load(filename) {
    this.filename = filename;
    this.yaml     = null;
    this.status   = {
      isValid: false,
      message: 'Error loading YAML file.'
    }

    let text;
    try {
      text = fs.readFileSync(filename);
    }
    catch (e) {
      this.status.message = `'${this.filename}' does not exist`;
      return false;
    }
    try {
      this.yaml = yaml.safeLoad(text);
    }
    catch (err) {
      this.status.message = `'${this.filename}' is not a valid yaml file\n${err.message}`;
      return false;
    }
    return this.validate();
  }
}

module.exports = Procedure;
