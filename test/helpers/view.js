const {Choices}   = require('../../src/lib/calibration.js')
const  Alert      = require('./alert.js');
const {PageIndex} = require('../../src/lib/page-index');

class View {
  constructor() {
    this.state = {
      disableInputs:  false,
      displayOverlay: false,
      sidebar:        null
    };
    this.alert = new Alert();
    this.wizard = {
      vnaAddress:        null,
      matrixAddress:     null,
      procedureFilename: '',
      calChoice:         Choices.NONE,
      calGroup:          null,
      calGroups:         [],
      ports:             {},
      index:             new PageIndex()
    };
  }

  renderNewParameters(params) {
    if (params.vnaAddress) {
      this.wizard.vnaAddress        = params.vnaAddress;
    }
    if (params.matrixAddress) {
      this.wizard.matrixAddress     = params.matrixAddress;
    }
    if (params.procedureFilename) {
      this.wizard.procedureFilename = params.procedureFilename;
    }
    if (params.calChoice) {
      this.wizard.calChoice         = params.calChoice;
    }
    if (params.calGroup) {
      this.wizard.calGroup          = params.calGroup;
    }
    if (params.calGroups) {
      this.wizard.calGroups         = params.calGroups;
    }
    if (params.ports) {
      this.wizard.ports             = params.ports;
    }
    if (params.index) {
      this.wizard.index             = params.index;
    }
    if (params.sidebar) {
      this.state.sidebar            = params.sidebar;
    }
  }
  getUserInputs() {
    return {
      vnaAddress:        this.wizard.vnaAddress,
      matrixAddress:     this.wizard.matrixAddress,
      procedureFilename: this.wizard.procedureFilename,
      calChoice:         this.wizard.calChoice,
      calGroup:          this.wizard.calGroup
    };
  }
  getSaveCalFromDialog() {
    return 'calibration';
  }
  render() {
    return;
  }
}

module.exports = View;
