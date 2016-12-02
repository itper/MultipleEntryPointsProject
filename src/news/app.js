import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import Routes from './Routes';
import './static/css/global.css';
import './static/css/index.css';
import './static/css/loading.css';

import { Provider } from 'react-redux'
import configureStore from './store';
Object.assign = require('object-assign');
require('es6-promise').polyfill();
import './css/base.css';
import './css/details.css';
import './css/guide.css';
import './css/list.css';
const initialState = window.__INITIALSTATE__;
const store = configureStore(initialState);

const rootEle = document.getElementById('app');

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>{Routes}</Router>
    </Provider>, rootEle);