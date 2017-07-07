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
      saveCalAs:         this.store.get('save-cal-as', '')
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
  set index(i) {
    this.setState({index: i});
  }

  render() {
    // settings page
    let isSettingsInvisible = this.state.index.page != Pages.SETTINGS;
    let settings = {
      vnaAddress:        this.vnaAddress,
      matrixAddress:     this.matrixAddress,
      procedureFilename: this.procedureFilename
    };
    let onSettingsChanges = {
      handleVnaAddressChange:        (event) => {this.vnaAddress        = event.target.value;},
      handleMatrixAddressChange:     (event) => {this.matrixAddress     = event.target.value;},
      handleProcedureFilenameChange: (event) => {this.procedureFilename = event.target.value;}
    };
    // choose cal page
    let isChooseCalPageInvisible = this.state.index.page != Pages.CHOOSE_CAL;
    let chooseCal = {
      choice:   this.state.calChoice,
      calGroup: this.state.calGroup
    };
    let onChooseCalChanges = {
      handleChoiceChange:   (event) => {
        console.log('Changing cal choice to: ' + event.target.value);
        this.calChoice = event.target.value;
        console.log('Cal choice now is: ' + this.calChoice);
      },
      handleCalGroupChange: (event) => {this.calGroup  = event.target.value}
    };
    return (
      <div id="pages" className="wizard row">
        <SettingsPage
          values={settings}
          onChanges={onSettingsChanges}
          invisible={isSettingsInvisible} />
        <ChooseCalPage
          values={chooseCal}
          onChanges={onChooseCalChanges}
          invisible={isChooseCalPageInvisible}/>
        <div id="console">
          Page {this.state.index.page}, step {this.state.index.step}
        </div>
      </div>
    );
  }
}

export default Wizard;
