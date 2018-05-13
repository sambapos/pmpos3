import { History } from 'history';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore, GenericStoreEnhancer, Store } from 'redux';
import RavenMiddleware from 'redux-raven-middleware';
import thunk from 'redux-thunk';
import promiseMiddleware from './middlewares/promiseMiddleware';
import * as StoreModule from './store';
import { IApplicationState, reducers } from './store';

export default function configureStore(history: History, initialState?: IApplicationState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    // If devTools is installed, connect to it
    const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension as () => GenericStoreEnhancer;

    const createStoreWithMiddleware = compose(
        applyMiddleware(
            thunk,
            promiseMiddleware(),
            routerMiddleware(history),
            RavenMiddleware('https://3aa4f0d5f3d14a64917921f03f76b957@sentry.io/944379')
        ),
        devToolsExtension ? devToolsExtension() : (f: {}) => f
    )(createStore);

    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(reducers);
    const store = createStoreWithMiddleware(allReducers, initialState) as Store<IApplicationState>;

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./store', () => {
            const nextRootReducer = require<typeof StoreModule>('./store');
            store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
        });

    }
    return store;
}

function buildRootReducer(allReducers: {}) {
    return combineReducers<IApplicationState>(Object.assign({}, allReducers, { routing: routerReducer }));
}
