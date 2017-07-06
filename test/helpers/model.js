const Procedure = require('../../src/lib/procedure.js');

class Model {
  constructor() {
    this.vnaAddress   = '127.0.0.1';
    this.matrixAddress   = '1.2.3.4';
    this.procedureFilename = null;
    this.calGroup          = null;

    this.calUnitPorts = () => {
      const ports = 2;
      console.log(`cal unit ports: ${ports}`);
      return ports;
    };
  }

  isVna() {
    console.log("Vna connected");
    return true;
  }
  isMatrix() {
    console.log("Switch matrix connected");
    return true;
  }

  getProcedure() {
    return new Procedure(this.procedureFilename, this.calUnitPorts());
  }

  isCalUnit() {
    console.log('is cal unit');
    return true;
  }
  startCalibration() {
    console.log('starting calibration');
    return true;
  }
  performCalibrationStep(i) {
    console.log('Performing calibration step ' + i);
    return true;
  }
  applyCalibration() {
    console.log('Applying calibration');
    return true;
  }
  saveCalibration(name) {
    console.log('Saving calibration as ' + name);
    this.calGroup = name;
    return true;
  }
  measure(i) {
    console.log('Performing measurement step ' + i);
    return true;
  }
}

module.exports = Model;
