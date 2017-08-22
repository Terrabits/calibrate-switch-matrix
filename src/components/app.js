import React, { Component } from 'react';

import Alert                from './alert.js';
import Button               from './button.js';
import Filename             from './filename.js';
import LineEdit             from './line-edit.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableInputs: false
    };
  }
  get disableInputs() {
    return this.state.disableInputs;
  }
  set disableInputs(value) {
    this.wizard.disableInputs = value;
    this.setState({disableInputs: value});
  }
  get address() {
    return this.state.address;
  }
  set address(value) {
    this.setState({address: value});
  }
  get filename() {
    return this.state.filename;
  }
  set filename(value) {
    this.setState({filename: value});
  }
  render() {
    let handleAddressChange = (event) => {
      this.address = event.target.value;
    };
    let handleFilenameChange = (value) => {
      this.filename = value;
    };
    return (
      <div className="window">
        <div className="window-content">
          <div className="pane-group">
            <div className="pane">
              <Alert  ref={(alert)  => {this.alert = alert;  }} />
              <LineEdit label={'Matrix address'}
                        value={this.address}
                        onChange={handleAddressChange}
                        disabled={this.disableInputs} />
              <Filename label={'Path file'}
                        filename={this.filename}
                        onChange={handleFilenameChange}
                        disabled={this.disableInputs} />
            </div>
          </div>
        </div>
        <footer className="toolbar toolbar-footer">
          <div className="toolbar-actions">
            <Button
              text="Apply"
              role="primary"
              pullRight={true}
              onClick={this.props.onApply}
              disabled={this.state.disableInputs}
            />
            <Button
              text="Close"
              role="default"
              pullRight={true}
              onClick={this.props.onClose}
              disabled={this.state.disableInputs}
            />
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
