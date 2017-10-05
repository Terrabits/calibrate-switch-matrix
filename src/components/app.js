import React, { Component } from 'react';

// import Alert   from './alert.js';
import Alert   from './alert.js';
import Button  from './button.js';
import Overlay from './overlay.js';
import Sidebar from './sidebar/sidebar.js';
import Wizard  from './wizard.js';

import electron from 'electron'
const remote    = electron.remote;
const  dialog   = remote.dialog;

// Note: removed header above window-content:
// <header className="toolbar toolbar-header draggable">
// <h1 className="title">{this.props.title || ''}</h1>
// </header>

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableInputs: false,
      displayOverlay: false,
      sidebar: null,
      changeIndex: null
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
      this.setState({sidebar: params.sidebar});
    }
    if (params.changeIndex) {
      this.setState({changeIndex: params.changeIndex});
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
    return 'calibrate switch matrix';
  }
  get disableInputs() {
    return this.state.disableInputs;
  }
  set disableInputs(value) {
    this.wizard.disableInputs = value;
    this.setState({disableInputs: value});
  }
  get displayOverlay() {
    return this.state.displayOverlay;
  }
  set displayOverlay(value) {
    this.setState({displayOverlay: value});
  }
  render() {
    return (
      <div className="window">
        <div className="window-content">
          <Overlay on={this.state.displayOverlay} />
          <div className="pane-group">
            <Sidebar
              ref={(sidebar) => { this.sidebar = sidebar; }}
              sections={this.state.sidebar}
              onClick={this.state.changeIndex} />
            <div className="pane">
              <Alert  ref={(alert)  => {this.alert = alert;  }} />
              <Wizard ref={(wizard) => {this.wizard = wizard;}} />
            </div>
          </div>
        </div>
        <footer className="toolbar toolbar-footer">
          <div className="toolbar-actions">
            <Button
              text="Next"
              role="primary"
              pullRight={true}
              onClick={this.props.onNext}
              disabled={this.state.disableInputs}
            />
            <Button
              text="Back"
              role="default"
              pullRight={true}
              onClick={this.props.onBack}
              disabled={this.state.disableInputs}
            />
            <Button
              text="Restart"
              role="default"
              pullRight={false}
              onClick={this.props.onRestart}
              disabled={this.state.disableInputs}
            />
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
