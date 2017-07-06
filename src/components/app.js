import React, { Component } from 'react';

// import Alert   from './alert.js';
import Sidebar from './sidebar/sidebar.js';
import Wizard  from './wizard.js';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let sections = [
      {name: 'Settings'},
      {name: 'Calibrate'},
      {name: 'Measure'}
    ];
    return (
      <div className="window">
        <header className="toolbar toolbar-header draggable">
          <h1 className="title">Header</h1>
        </header>
        <div className="window-content">
          <div className="pane-group">
            <Sidebar sections={sections} ref={(sidebar) => { this.sidebar = sidebar; }} />
            <div className="pane padded-more">
              <Wizard ref={(wizard) => {this.wizard = wizard;}} />
            </div>
          </div>
        </div>
        <footer className="toolbar toolbar-footer">
          <div className="toolbar-actions">
            <button className="btn btn-primary pull-right">
              Save
            </button>
            <button className="btn btn-default pull-right">
              Cancel
            </button>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
