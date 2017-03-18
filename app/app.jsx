/* global document window */

// Client side modules
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import router from 'app/router/index';
// import * as actions from './actions/actions';
import configure from 'app/store/configureStore';

// STYLES
require('app/styles/main.scss');
// require('codemirror/lib/codemirror.css');

const store = configure();

// XXX: DEBUGGING - CAN REMOVE
window._DEBUG = false;

ReactDOM.render(
    <div>
        <Provider store={store}>
            {router}
        </Provider>
    </div>,
    document.getElementById('app')
);

