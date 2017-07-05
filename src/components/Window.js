import React, { Component } from 'react';

class Window extends React.Component {
  render() {
    return (
      <div className="window">
        <header className="toolbar toolbar-header draggable">
          <h1 className="title">Header</h1>
        </header>
        <div className="window-content">
          <div className="pane-group">
            <div className="pane-sm sidebar padded-more">
              <nav className="nav-group">
                <h5 className="nav-group-title">
                  Favorites
                </h5>
                <span className="nav-group-item active">
                    <span className="icon icon-home"></span>
                    Home
                </span>
                <span className="nav-group-item">
                  <span className="icon icon-download"></span>
                  Downloads
                </span>
                <span className="nav-group-item">
                  <span className="icon icon-folder"></span>
                  Documents
                </span>
                <span className="nav-group-item">
                  <span className="icon icon-signal"></span>
                  AirPlay
                </span>
                <span className="nav-group-item">
                  <span className="icon icon-print"></span>
                  Applications
                </span>
                <span className="nav-group-item">
                  <span className="icon icon-cloud"></span>
                  Desktop
                </span>
              </nav>
            </div>
            <div className="pane padded-more">
              <h1>Hello, Electron!</h1>
              <p>I hope you enjoy using basic-electron-react-boilerplate to start your dev off right!</p>
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

export default Window;
