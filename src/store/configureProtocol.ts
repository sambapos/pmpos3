var Y = require('yjs');
require('y-array/y-array.js');
require('y-memory');
require('y-map');
import yclient from '../lib/y-websockets-client';
require('y-indexeddb')(Y);

import { ApplicationState } from './index';
import { Commit } from '../models/Commit';

export default (
    terminalId: string,
    networkName: string,
    user: string,
    dispatch: (action: any) => void,
    getState: () => ApplicationState,
    cb: (protocol: any) => void) => {

    yclient(Y);
    const persistence = new Y.IndexedDB();

    let y = new Y(
        networkName, {
            connector: {
                name: 'websockets-client',
                url: 'https://my-websockets-server.herokuapp.com/'
            }
        },
        persistence);

    let chatprotocol = y.define('chat', Y.Array);
    let commitProtocol = y.define('commits', Y.Array);
    let configProtocol = y.define('config', Y.Map);

    dispatchCommitProtocol(dispatch, commitProtocol);
    dispatchConfigProtocol(dispatch, configProtocol);

    configProtocol.observe(event => {
        dispatchConfigEvent(dispatch, event.target);
    });

    commitProtocol.observe(event => {
        let values: any[] = [];
        event.addedElements.forEach(x => values = values.concat(x._content));
        dispatchCommitEvent(dispatch, values);
    });

    chatprotocol.observe(event => {
        event.addedElements.forEach(x => dispatchChatEvent(dispatch, x._content[0]));
        if (chatprotocol.length > 10) {
            chatprotocol.delete(0, chatprotocol.length - 10);
        }
    });
    cb(y);
};

function dispatchConfigProtocol(dispatch: any, protocol: any) {
    dispatch({
        type: 'SET_CONFIG_PROTOCOL',
        protocol
    });
}

function dispatchCommitProtocol(dispatch: any, protocol: any) {
    dispatch({
        type: 'SET_COMMIT_PROTOCOL',
        protocol
    });
}

function dispatchConfigEvent(dispatch: any, value: any) {
    dispatch({
        type: 'CONFIG_RECEIVED',
        payload: value.keys().reduce((x, y) => x.set(y, value.get(y)), new Map<string, any>())
    });
}

function dispatchCommitEvent(dispatch: any, values: Commit[]) {
    dispatch({
        type: 'COMMIT_RECEIVED',
        values
    });
}

function dispatchChatEvent(dispatch: any, value: any) {
    dispatch({
        type: 'ADD_MESSAGE',
        time: value.time,
        message: value.message,
        user: value.user,
        id: value.id,
        lamport: value.lamport
    });
}
