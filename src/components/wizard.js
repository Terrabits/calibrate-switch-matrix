import React                 from 'react';

import CalibratePage         from './pages/calibrate.js';
import ChooseCalibrationPage from './pages/choose-calibration.js';
import PageIndex             from '../lib/page-index.js';
import {Pages}                 from '../lib/controller.js';
import MeasurePage           from './pages/measure.js';
import SettingsPage          from './pages/settings.js';

import Store from 'electron-store';
const  store = new Store();

const CalibrationChoices = {
  NONE: 'no calibration',
  EXISTING: 'use existing calibration',
  CALIBRATE: 'calibrate'
}

class Wizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index:             new PageIndex(),
      vnaAddress:        store.get('vna-address', 'localhost'),
      matrixAddress:     store.get('matrix-address', '192.168.1.101'),
      procedureFilename: store.get('procedure-filename', ''),
      calibrationChoice: store.get('calibration-choice', CalibrationChoices.CALIBRATE),
      calGroup:          store.get('cal-group', ''),
      saveCalibrationAs: store.get('save-calibration-as', '')
    };
  }

  get vnaAddress() {
    return this.state.vnaAddress;
  }
  set vnaAddress(addr) {
    store.set('vna-address', addr);
    this.setState({vnaAddress: addr});
  }
  get matrixAddress() {
    return this.state.matrixAddress;
  }
  set matrixAddress(addr) {
    store.set('matrix-address', addr);
    this.setState({matrixAddress: addr});
  }
  get procedureFilename() {
    return this.state.procedureFilename;
  }
  set procedureFilename(filename) {
    store.set('procedure-filename', filename);
    this.setState({procedureFilename: filename});
  }
  get calibrationChoice() {
    this.state.calibrationChoice;
  }
  set calibrationChoice(choice) {
    store.set('calibration-choice', choice);
    this.setState({calibrationChoice: choice});
  }
  get calGroup() {
    return this.state.calGroup;
  }
  set calGroup(name) {
    store.set('cal-group', name);
    this.setState({calGroup: name});
  }
  get saveCalibrationAs() {
    return this.state.saveCalibrationAs;
  }
  set saveCalibrationAs(name) {
    store.set('save-calibration-as', name);
    this.setState({saveCalibrationAs: name});
  }

  setPage(page, step) {
    const index = new PageIndex(page, step);
    this.setState({
      index: index
    });
  }

  render() {
    let settings = {
      vnaAddress:        this.vnaAddress,
      matrixAddress:     this.matrixAddress,
      procedureFilename: this.procedureFilename
    };
    let onSettingsChanges = {
      handleVnaAddressChange:        (event) => {this.vnaAddress = event.target.value;},
      handleMatrixAddressChange:     (event) => {this.matrixAddress = event.target.value;},
      handleProcedureFilenameChange: (event) => {this.procedureFilename = event.target.value;}
    };
    return (
      <div id="pages" className="wizard row">
        <SettingsPage values={settings} onChanges={onSettingsChanges} invisible={this.state.index.page != Pages.SETTINGS} />
        <div id="console">
          Page {this.state.index.page}, step {this.state.index.step}
        </div>
      </div>
    );
  }
}

export default Wizard;
