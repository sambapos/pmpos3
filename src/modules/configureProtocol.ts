var Y = require('yjs');
require('y-array/y-array.js');
require('y-memory');
require('y-map');
require('y-indexeddb')(Y);
import yclient from '../lib/y-websockets-client';

import { Commit } from 'pmpos-models';

export default (
    terminalId: string,
    networkName: string,
    user: string,
    onConnect: (chatProtocol: any, commitProtocol: any, configProtocol: any) => void,
    onChatEvent: (messages: {
        time: number,
        message: string,
        user: string,
        id: string,
        lamport: number
    }[]) => void,
    onConfigEvent: (config: Map<string, any>) => void,
    onCommitEvent: (commits: Commit[]) => void
) => {
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

    onConnect(chatprotocol, commitProtocol, configProtocol);

    configProtocol.observe(event => {
        let value = event.target;
        let config = value.keys().reduce((r, key) => r.set(key, value.get(key)), new Map<string, any>());
        onConfigEvent(config);
    });

    commitProtocol.observe(event => {
        let elements: any[] = Array.from(event.addedElements);
        let commits = elements.reduce(
            (r: Commit[], e) => {
                r.push(...e._content);
                return r;
            },
            [] as Commit[]);
        onCommitEvent(commits);
    });

    chatprotocol.observe(event => {
        let elements: any[] = Array.from(event.addedElements);
        let messages = elements.reduce(
            (r: any[], e) => {
                r.push(...e._content);
                return r;
            },
            []);
        onChatEvent(messages);
        if (chatprotocol.length > 10) {
            chatprotocol.delete(0, chatprotocol.length - 10);
        }
    });
};