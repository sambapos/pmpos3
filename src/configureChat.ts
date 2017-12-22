import * as IPFS from 'ipfs';
import * as Y from 'yjs';
import yArray from 'y-array';
import yMemory from 'y-memory';
import yIndexedDb from 'y-indexeddb';
import yIpfsConnector from 'y-ipfs-connector';
import { Store } from 'redux';
import { ApplicationState } from './store/index';

export default function configureChat(store: Store<ApplicationState>) {

    Y.extend(yArray, yMemory, yIndexedDb, yIpfsConnector);

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
            console.log('ipfs node ready ', info.id);
        });
    });

    function repo() {
        return 'ipfs/pubsub-demo/' + Math.random();
    }

    Y({
        db: {
            name: 'indexeddb'
        },
        connector: {
            name: 'ipfs',
            room: 'chat-example',
            ipfs: ipfs
        },
        share: {
            chat: 'Array'
        }
    }).then((y) => {
        (<any>window).yChat = y;

        y.share.chat.observe(event => {
            if (event.type === 'insert') {
                for (let i = 0; i < event.length; i++) {
                    store.dispatch({ type: 'ADD_MESSAGE', message: event.values[i] });
                }
            }
        });
    });
}
