import * as Client from './Client';
import * as Tasks from './Tasks';
import * as Cards from './Cards';
import * as Config from './Config';
import { List, Map } from 'immutable';
import * as Chat from './Chat';

// The top-level state object
export interface ApplicationState {
    client: Client.ClientState;
    tasks: List<Map<any, any>>;
    cards: Cards.StateRecord;
    chat: Chat.StateRecord;
    config: Config.ConfigStateRecord;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    client: Client.reducer,
    tasks: Tasks.reducer,
    cards: Cards.reducer,
    chat: Chat.reducer,
    config: Config.reducer
};

export const epics = {
    cards: Cards.epic
};