const {Choices: CalibrationChoices} = require('../../src/lib/calibration.js')

class View {
  constructor() {
    this.vnaAddress = '127.0.0.1';
    this.ospAddress = '1.2.3.4';
    this.procedureFilename = ''
    this.calibrationChoice = CalibrationChoices.NONE;
    this.calGroup = 'my cal group';
    this.page = null;
  }

  setPage(index, params) {
    this.page = {
      index: index,
      params: params
    };
  }
}

module.exports = View;
