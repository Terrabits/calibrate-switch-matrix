import React          from 'react';
import ReactDOM       from 'react-dom';
import {AppContainer} from 'react-hot-loader';

import App from './components/app.js';

import './assets/css/global.css';
import './vendor/photon/css/photon.css';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

// Now we can render our application into it
window.render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  )
}

window.render(App)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/app', () => { window.render(App) })
}
