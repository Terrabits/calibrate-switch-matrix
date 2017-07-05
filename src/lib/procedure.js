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
    let status = Object.create(null);
    status.isValid = false;

    if (!this.isFile) {
      status.message = `'${this.filename}' does not exist`;
      return status;
    }
    if (!this.isYaml) {
      status.message = `'${this.filename} is not valid yaml file'`;
      return status;
    }

    // TODO: Look for essential parts?
    // TODO: make switch matrix, calibration optional steps?
    // TODO: Put yaml validation into python? One spot?
    let requiredProperties = ['name',
                              'switch matrix',
                              'vna calibration',
                              'measurement steps'
                             ];
    for (let i of requiredProperties) {
      if (!this.yaml.hasOwnProperty(i)) {
        // TODO: error message
        status.message = `${i} missing in procedure`;
        return status;
      }
    }
    if (!this.yaml['measurement steps']) {
      // TODO: Error message
      status.message = `No measurement steps found`;
      return status;
    }
    if (!this.yaml['measurement steps'].length) {
      // TODO: Error message
      status.message = `No measurement steps found`;
      return status;
    }
    for (let step of this.yaml['measurement steps']) {
      requiredProperties = ['name',
                            'vna connections',
                            'measurements'
                           ];
      for (let i of requiredProperties) {
        if (!step.hasOwnProperty(i)) {
          // TODO: Error message
          status.message = `Measurement step(s) missing '${i}'`;
          return status;
        }
      }
      if (!Object.getOwnPropertyNames(step['vna connections']).length) {
        // TODO: Error message
        status.message = `Measurement step(s) missing vna connections`;
        return status;
      }
      if (!step['measurements'].length) {
        // TODO: Error message
        status.message = `No measurements in procedure`;
        return status;
      }
      for (let meas of step['measurements']) {
        if (!meas.hasOwnProperty('switch path')) {
          // TODO: Error message
          status.message = `Measurement step(s) missing switch path`;
          return status;
        }
        if (!meas.hasOwnProperty('vna setup')) {
          // TODO: Error message
          status.message = `Measurement step(s) missing vna setup`;
          return status;
        }
        if (!meas.hasOwnProperty('vna ports')) {
          // TODO: Error message
          status.message = `Measurement step(s) missing vna ports`;
          return status;
        }
        if (!meas['vna ports'].length) {
          // TODO: Error message
          status.message = `Measurement step(s) missing vna ports`;
          return status;
        }
      }
    }
    // Else
    status.isValid = true;
    return status;
  }

  load(filename) {
    this.filename = filename;
    this.isFile   = false;
    this.isYaml   = false;
    this.isValid  = false;
    this.yaml     = Object.create(null);

    let text;
    try {
      text = fs.readFileSync(filename);
    }
    catch (e) {
      return;
    }
    this.isFile = true;

    try {
      this.yaml = yaml.safeLoad(text);
    }
    catch (e) {
      return;
    }
    this.isYaml = true;
    let status = this.validate();
    this.isValid = status.isValid;
  }
}

module.exports = Procedure;
