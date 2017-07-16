import React         from 'react';
const  Store    = require('electron-store');

import CalibratePage from './pages/calibrate.js';
import Choices       from '../lib/calibration.js';
import ChooseCalPage from './pages/choose-cal.js';
import PageIndex     from '../lib/page-index.js';
import {Pages}       from '../lib/controller.js';
import MeasurePage   from './pages/measure.js';
import SettingsPage  from './pages/settings.js';

class Wizard extends React.Component {
  constructor(props) {
    super(props);
    this.store = new Store();
    this.state = {
      // defaults
      index:             new PageIndex(Pages.SETTINGS),
      vnaAddress:        '127.0.0.1',
      matrixAddress:     '1.2.3.4',
      procedureFilename: '/procedure.yaml',
      calChoice:         Choices.CALIBRATE,
      calGroup:          'cal group 1',
      saveCalAs:         this.store.get('save-cal-as', ''),
      ports:             [-1],
    };
  }

  get vnaAddress() {
    return this.state.vnaAddress;
  }
  set vnaAddress(addr) {
    this.setState({vnaAddress: addr});
  }
  get matrixAddress() {
    return this.state.matrixAddress;
  }
  set matrixAddress(addr) {
    this.setState({matrixAddress: addr});
  }
  get procedureFilename() {
    return this.state.procedureFilename;
  }
  set procedureFilename(filename) {
    this.setState({procedureFilename: filename});
  }
  get calChoice() {
    return this.state.calChoice;
  }
  set calChoice(choice) {
    this.setState({calChoice: choice});
  }
  get calGroup() {
    return this.state.calGroup;
  }
  set calGroup(name) {
    this.setState({calGroup: name});
  }
  get saveCalAs() {
    return this.state.saveCalAs;
  }
  set saveCalAs(name) {
    this.store.set('save-cal-as', name);
    this.setState({saveCalAs: name});
  }
  set ports(value) {
    this.setState({'ports': value});
  }
  set index(i) {
    this.setState({index: i});
  }

  render() {
    // settings page
    const isSettingsInvisible = this.state.index.page != Pages.SETTINGS;
    const settings = {
      vnaAddress:        this.vnaAddress,
      matrixAddress:     this.matrixAddress,
      procedureFilename: this.procedureFilename
    };
    const onSettingsChanges = {
      handleVnaAddressChange:        (event) => {this.vnaAddress        = event.target.value;},
      handleMatrixAddressChange:     (event) => {this.matrixAddress     = event.target.value;},
      handleProcedureFilenameChange: (event) => {this.procedureFilename = event.target.value;}
    };
    // choose cal page
    const isChooseCalPageInvisible = this.state.index.page != Pages.CHOOSE_CAL;
    const chooseCal = {
      choice:   this.state.calChoice,
      calGroup: this.state.calGroup
    };
    const onChooseCalChanges = {
      handleChoiceChange:   (event) => {
        this.calChoice = event.target.value;
      },
      handleCalGroupChange: (event) => {this.calGroup  = event.target.value}
    };
    const isCalibrationInvisible = this.state.index.page != Pages.CALIBRATE;
    const calibration = {
      index: this.state.index,
      ports: (isCalibrationInvisible? [] : this.state.ports)
    };
    const isMeasureInvisible = this.state.index.page != Pages.MEASURE;
    const measure = {
      index: this.state.index,
      ports: (isMeasureInvisible? {} : this.state.ports)
    };
    console.log('wizard ports: ' + this.state.ports);

    return (
      <div id="pages" className="wizard padded-more">
        <SettingsPage
          values={settings}
          onChanges={onSettingsChanges}
          invisible={isSettingsInvisible} />
        <ChooseCalPage
          values={chooseCal}
          onChanges={onChooseCalChanges}
          invisible={isChooseCalPageInvisible}/>
        <CalibratePage
          index={calibration.index}
          ports={calibration.ports}
          invisible={isCalibrationInvisible}
        />
        <MeasurePage
          index={measure.index}
          ports={measure.ports}
          invisible={isMeasureInvisible}
        />
      </div>
    );
  }
}

export default Wizard;
