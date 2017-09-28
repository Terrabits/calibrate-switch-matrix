import React           from 'react';
import ReactDOM        from 'react-dom';
import {AppContainer}  from 'react-hot-loader';

import App             from './components/app.js';
import Controller      from './lib/controller.js';
import Model           from './lib/model.js';

import Store           from 'electron-store';
import ElectronConsole from 'winston-electron';
import winston         from 'winston';

import path            from 'path';

import './vendor/photon/sass/photon.scss';
import './assets/css/global.scss';

// logging
const store = new Store();
const log_filename = path.resolve(store.path, '../', 'ui log.txt');
window.winston  = new winston.Logger({
  transports: [
    new ElectronConsole({
      level: 'warn',
      handleExceptions: true,
      humanReadableExceptions: true
    }),
    new (winston.transports.File)({
      filename: log_filename,
      level: 'silly',
      handleExceptions: true,
      humanReadableExceptions: true
    })
  ],
  exitOnError: false
})

// Probably not best practices, but...
const pkg = require('../package.json');

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

// View
window.render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component
        ref={(app) => { window.view = app; }}
        title={`${pkg.productName} ${pkg.version}`}
        onNext={   () => {controller.next()}}
        onBack={   () => {controller.back()}}
        onRestart={() => {controller.restart()}}/>
    </AppContainer>,
    document.getElementById('root')
  )
};

window.render(App)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/app', () => { window.render(App) })
}

window.model      = new Model();
window.controller = new Controller(model, view);
controller.restart();
