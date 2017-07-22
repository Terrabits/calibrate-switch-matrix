import React, { Component } from 'react';

// import Alert   from './alert.js';
import Alert   from './alert.js';
import Button  from './button.js';
import Sidebar from './sidebar/sidebar.js';
import Wizard  from './wizard.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableInputs: false,
      sidebar: null
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
    console.log('save cal as...');
    return 'calibration';
  }
  get disableInputs() {
    return this.state.disableInputs;
  }
  set disableInputs(value) {
    this.wizard.disableInputs = value;
    this.setState({disableInputs: value});
  }
  render() {
    return (
      <div className="window">
        <header className="toolbar toolbar-header draggable">
          <h1 className="title">{this.props.title || ''}</h1>
        </header>
        <div className="window-content">
          <div className="pane-group">
            <div className="pane-sm sidebar">
            <Sidebar
              ref={(sidebar) => { this.sidebar = sidebar; }}
              sections={this.state.sidebar} />
            </div>
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
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
