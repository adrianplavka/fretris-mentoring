
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Routes from './routes';
import { log } from './utils/logger';
import { isDevMode } from './utils/dev';
import { initStore } from './reducers/store';
import Connection from './network';
import './styles.css';

log("Index", "Started in development mode.");

export const connection = new Connection();
export const store = initStore();

const app = (
    <Provider store={store}>
        <Routes />
    </Provider>
);
const rootElem = document.getElementById('root');

ReactDOM.render(app, rootElem);
