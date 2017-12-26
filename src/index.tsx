import './index.css';
import 'typeface-roboto';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import configureStore from './configureStore';
import * as RoutesModule from './routes';
import { saveState } from './localStorage';
import { uuidv4 } from './lib/uuid';

let routes = RoutesModule.routes;

const history = createBrowserHistory();
const initialState = undefined; // loadState();
const store = configureStore(history, initialState);

store.subscribe(() => {
  saveState(store.getState());
});

let terminalId = localStorage.getItem('terminalId');
if (!terminalId) {
  terminalId = uuidv4();
  localStorage.setItem('terminalId', terminalId as string);
}
store.dispatch({ type: 'SET_TERMINAL_ID', terminalId });

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
