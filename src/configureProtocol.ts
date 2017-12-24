import * as IPFS from 'ipfs';
import Y from 'yjs/dist/y';
import yMemory from 'y-memory/dist/y-memory';
import yArray from 'y-array/dist/y-array';
import yMap from 'y-map/dist/y-map';
import ipfsConnector from 'y-ipfs-connector';

import { Store } from 'redux';
import { ApplicationState } from './store/index';

export default function configureChat(store: Store<ApplicationState>) {

    yMemory(Y);
    yArray(Y);
    yMap(Y);
    ipfsConnector(Y);

    const ipfs = new IPFS({
        repo: repo(),
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
            if (err) { throw err; }
        });
    });

    function repo() {
        return 'ipfs/pubsub-demo/' + Math.random();
    }

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
            blocks: 'Map'
        }
    }).then((y) => {
        (<any>window).protocol = y;

        y.share.chat.observe(event => {
            if (event.type === 'insert') {
                for (let i = 0; i < event.length; i++) {
                    store.dispatch({ type: 'ADD_MESSAGE', message: event.values[i] });
                }
            }
        });

        y.share.blocks.observeDeep(event => {
            console.log('block event', event);
            if (event.type === 'add') {
                store.dispatch({
                    type: 'REGISTER_BLOCK_ACTION', id: event.name,
                    payload: { type: 'CREATE_BLOCK', data: JSON.stringify({ bid: event.name }) },
                });
                event.value.toArray().forEach(element => {
                    store.dispatch({ type: 'REGISTER_BLOCK_ACTION', id: event.name, payload: element });
                });
            } else if (event.type === 'insert') {
                event.values.forEach(element => {
                    store.dispatch({ type: 'REGISTER_BLOCK_ACTION', id: event.path[0], payload: element });
                });
            }
        });
    });
}
