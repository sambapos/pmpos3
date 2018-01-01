import * as IPFS from 'ipfs';
import Y from 'yjs/dist/y';
import yMemory from 'y-memory/dist/y-memory';
import yArray from 'y-array/dist/y-array';
import yMap from 'y-map/dist/y-map';
import yIndexedDb from 'y-indexeddb/dist/y-indexeddb';
import * as ipfsConnector from '../../lib/y-ipfs-connector';

// import ipfsConnector from 'y-ipfs-connector';

yMemory(Y);
yArray(Y);
yMap(Y);
yIndexedDb(Y);
ipfsConnector(Y);

import { ApplicationState } from '../index';
import { KnownActions } from './KnownActions';
import { Commit } from '../Cards/models';

export default (
    terminalId: string, user: string,
    dispatch: (action: KnownActions) => void,
    getState: () => ApplicationState,
    cb: (protocol: any) => void) => {

    const ipfs = new IPFS({
        repo: 'ipfs/PM-POS/' + terminalId + '/' + (user ? user : Math.random()),
        EXPERIMENTAL: {
            pubsub: true
        },
        config: {
            Addresses: {
                Swarm: [
                    '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
                ]
            }
        }
    });

    ipfs.once('ready', () => {
        ipfs.id((err, info) => {
            if (err) {
                throw err;
            }
        });
    });

    Y({
        db: {
            name: 'memory'
        },
        connector: {
            name: 'ipfs',
            room: 'pmpos-protocol',
            ipfs: ipfs
        },
        share: {
            chat: 'Array',
            actionLog: 'Map',
            commits: 'Array'
        }
    }).then((y) => {
        dispatchCommitProtocol(dispatch, y.share.commits);

        dispatchCommitEvent(dispatch, y.share.commits.toArray());

        y.share.commits.observe(event => {
            console.log('event', event);
            dispatchCommitEvent(dispatch, event.values);
        });

        y.share.chat.toArray().forEach(x => dispatchChatEvent(dispatch, x));
        y.share.chat.observe(event => {
            if (event.type === 'insert') {
                for (let i = 0; i < event.length; i++) {
                    dispatchChatEvent(dispatch, event.values[i]);
                }
            }
        });

        y.share.actionLog.keys().forEach(k => {
            y.share.actionLog.get(k).toArray().forEach(element => {
                dispatchActionLogEvent(dispatch, k, element);
            });
        });
        y.share.actionLog.observeDeep(event => {
            if (event.type === 'add') {
                event.value.toArray().forEach(element => {
                    dispatchActionLogEvent(dispatch, event.name, element);
                });
            } else if (event.type === 'insert') {
                event.values.forEach(element => {
                    dispatchActionLogEvent(dispatch, event.path[0], element);
                });
            }
        });
        cb(y);
    });
};

function dispatchCommitProtocol(dispatch: any, protocol: any) {
    dispatch({
        type: 'SET_COMMIT_PROTOCOL',
        protocol
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
        id: value.id
    });
}

function dispatchActionLogEvent(dispatch: any, key: any, value: any) {
    dispatch({
        type: 'REGISTER_BLOCK_ACTION',
        blockId: key,
        payload: value
    });
    dispatchPayload(dispatch, value);
}

function dispatchPayload(dispatch: any, payload: any) {
    dispatch({
        type: payload.type,
        blockId: payload.blockId,
        data: JSON.parse(payload.data)
    });
}