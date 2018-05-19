import * as Client from './Client';
import * as Cards from './Cards';
import * as Config from './Config';

// The top-level state object
export interface IApplicationState {
    client: Client.IClientState;
    cards: Cards.StateRecord;
    config: Config.ConfigStateRecord;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    client: Client.reducer,
    cards: Cards.reducer,
    config: Config.reducer
};