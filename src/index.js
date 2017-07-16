import React          from 'react';
import ReactDOM       from 'react-dom';
import {AppContainer} from 'react-hot-loader';

import App            from './components/app.js';
import {Controller}   from './lib/controller.js';
import Model          from './lib/model.js';

import path           from 'path';

import './vendor/photon/sass/photon.scss';
import './assets/css/global.scss';


// Probably not best practices, but...
const pkg = require('../package.json');

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

// Model, Controller
window.model      = new Model();
window.controller = new Controller(model, window.view);

// View
window.render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component
        ref={(app) => { window.view = app; }}
        title={`${pkg.productName} ${pkg.version}`}
        onNext={() => {controller.next()}}
        onBack={() => {controller.back()}}/>
    </AppContainer>,
    document.getElementById('root')
  )
};

window.render(App)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/app', () => { window.render(App) })
}

controller.view = window.view
controller.restart();
