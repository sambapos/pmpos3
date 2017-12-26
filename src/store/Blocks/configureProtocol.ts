import * as IPFS from 'ipfs';
import Y from 'yjs/dist/y';
import yMemory from 'y-memory/dist/y-memory';
import yArray from 'y-array/dist/y-array';
import yMap from 'y-map/dist/y-map';
import yIndexeddb from 'y-indexeddb/dist/y-indexeddb';
import ipfsConnector from 'y-ipfs-connector';

yMemory(Y);
yArray(Y);
yMap(Y);
yIndexeddb(Y);
ipfsConnector(Y);

import { ApplicationState } from '../index';
import { KnownActions } from './KnownActions';

export default (
    terminalId: string, user: string,
    dispatch: (action: KnownActions) => void,
    getState: () => ApplicationState,
    cb: (protocol: any) => void) => {

    const ipfs = new IPFS({
        // repo: 'ipfs/PM-POS/' + terminalId + '/' + (user ? user : Math.random()),
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
            console.log('ipfs', info);
            if (err) {
                throw err;
            }
        });
    });

    Y({
        db: {
            name: 'indexeddb'
        },
        connector: {
            name: 'ipfs',
            room: 'pmpos-protocol',
            ipfs: ipfs
        },
        share: {
            chat: 'Array',
            actionLog: 'Map'
        }
    }).then((y) => {

        y.share.chat.observe(event => {
            console.log('chat event', event);
            if (event.type === 'insert') {
                for (let i = 0; i < event.length; i++) {
                    dispatch({
                        type: 'ADD_MESSAGE',
                        date: event.values[i].date,
                        message: event.values[i].message,
                        user: event.values[i].user,
                        id: event.values[i].id
                    });
                }
            }
        });

        y.share.actionLog.observeDeep(event => {
            if (event.type === 'add') {
                event.value.toArray().forEach(element => {
                    dispatch({
                        type: 'REGISTER_BLOCK_ACTION',
                        blockId: event.name,
                        payload: element
                    });
                });
            } else if (event.type === 'insert') {
                event.values.forEach(element => {
                    dispatch({
                        type: 'REGISTER_BLOCK_ACTION',
                        blockId: event.path[0],
                        payload: element
                    });
                });
            }
        });
        cb(y);
    });
};