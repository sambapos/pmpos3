import { createStore, applyMiddleware, compose, combineReducers, GenericStoreEnhancer, Store } from 'redux';
import thunk from 'redux-thunk';
import RavenMiddleware from 'redux-raven-middleware';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import * as StoreModule from './store';
import { ApplicationState, reducers, epics } from './store';
import { History } from 'history';
import promiseMiddleware from './middlewares/promiseMiddleware';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { values } from 'lodash';

export default function configureStore(history: History, initialState?: ApplicationState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    // If devTools is installed, connect to it
    const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension as () => GenericStoreEnhancer;
    const epicMiddleware = createEpicMiddleware(buildRootEpic(epics));
    const createStoreWithMiddleware = compose(
        applyMiddleware(
            thunk,
            promiseMiddleware(),
            routerMiddleware(history),
            RavenMiddleware('https://3aa4f0d5f3d14a64917921f03f76b957@sentry.io/944379'),
            epicMiddleware
        ),
        devToolsExtension ? devToolsExtension() : (f: {}) => f
    )(createStore);

    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(reducers);
    const store = createStoreWithMiddleware(allReducers, initialState) as Store<ApplicationState>;

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./store', () => {
            const nextRootReducer = require<typeof StoreModule>('./store');
            store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
            epicMiddleware.replaceEpic(buildRootEpic(nextRootReducer.epics));
        });

    }
    return store;
}

function buildRootEpic(allEpics: {}) {
    return combineEpics(...values(epics));
}

function buildRootReducer(allReducers: {}) {
    return combineReducers<ApplicationState>(Object.assign({}, allReducers, { routing: routerReducer }));
}
