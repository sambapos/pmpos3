import './index.css';
import 'typeface-roboto';
import 'rxjs';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import configureStore from './configureStore';
import * as RoutesModule from './routes';
import * as shortid from 'shortid';

let routes = RoutesModule.routes;

const history = createBrowserHistory();
const initialState = undefined; // loadState();
const store = configureStore(history, initialState);
localStorage.debug = 'y*,card-manager';

let terminalId = localStorage.getItem('terminalId');
if (!terminalId) {
  terminalId = shortid.generate();
}
let networkName = localStorage.getItem('networkName');
if (!networkName) {
  networkName = 'DEMO';
}
let serverName = localStorage.getItem('serverName') || '';
store.dispatch({ type: 'SET_TERMINAL_ID', terminalId, networkName, serverName });

function renderApp() {
  // This code starts up the React app when it runs in a browser. It sets up the routing configuration
  // and injects the app into a DOM element.
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history} children={routes} />
    </Provider>,
    document.getElementById('root')
  );
}

renderApp();

if (module.hot) {
  module.hot.accept('./routes', () => {
    routes = require<typeof RoutesModule>('./routes').routes;
    renderApp();
  });
}

registerServiceWorker();
