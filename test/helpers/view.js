const {Choices: CalibrationChoices} = require('../../src/lib/calibration.js')

class View {
  constructor() {
    this.vnaAddress = '127.0.0.1';
    this.matrixAddress = '1.2.3.4';
    this.procedureFilename = ''
    this.calibrationChoice = CalibrationChoices.NONE;
    this.calGroup = 'my cal group';
    this.page = null;
    this.state = {
      sidebar: null
    };
    this.alert = {
      showMessage: () => {},
      clear: () => {}
    }
  }

  renderNewParameters(params) {
    return;
  }
  getUserInputs() {
    return {
      vnaAddress:        this.vnaAddress,
      matrixAddress:     this.matrixAddress,
      procedureFilename: this.procedureFilename,
      calChoice:         this.calChoice,
      calGroup:          this.calGroup
    };
  }
  getSaveCalFromDialog() {
    console.log('save cal as...');
    return 'calibration';
  }
  render() {
    return;
  }
}

module.exports = View;
