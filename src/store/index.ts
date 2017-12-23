import * as Client from './Client';
import * as Tasks from './Tasks';
import * as Documents from './Documents';
import * as Chat from './Chat';
import * as Blocks from './Blocks';
import { List, Map } from 'immutable';

// The top-level state object
export interface ApplicationState {
    client: Client.ClientState;
    tasks: List<Map<any, any>>;
    documents: Map<any, any>;
    chat: List<Map<any, any>>;
    blocks: Map<string, List<any>>;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    client: Client.reducer,
    tasks: Tasks.reducer,
    documents: Documents.reducer,
    chat: Chat.reducer,
    blocks: Blocks.reducer
};