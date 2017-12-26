import * as IPFS from 'ipfs';
import Y from 'yjs/dist/y';
import yMemory from 'y-memory/dist/y-memory';
import yArray from 'y-array/dist/y-array';
import yMap from 'y-map/dist/y-map';
import ipfsConnector from 'y-ipfs-connector';

yMemory(Y);
yArray(Y);
yMap(Y);
ipfsConnector(Y);

import { Reducer } from 'redux';
import { Map as IMap, List as IList, fromJS } from 'immutable';
import { AppThunkAction } from './appThunkAction';
import { uuidv4 } from './uuid';
import { ApplicationState } from './index';
import { fail } from 'assert';

type RegisterBlockActionAction = {
    type: 'REGISTER_BLOCK_ACTION',
    blockId: string,
    payload: any
};

type ConnectProtocolAction = {
    type: 'CONNECT_PROTOCOL',
    terminalId: string,
    user: string,
    payload: Promise<any>
};

type ConnectProtocolRequestAction = {
    type: 'CONNECT_PROTOCOL_REQUEST'
};

type ConnectProtocolSuccessAction = {
    type: 'CONNECT_PROTOCOL_SUCCESS'
    payload: any
};

type ConnectProtocolFailAction = {
    type: 'CONNECT_PROTOCOL_FAIL'
};

type AddMessageAction = {
    type: 'ADD_MESSAGE'
    id: string
    user: string
    message: string
};

type KnownActions = RegisterBlockActionAction | AddMessageAction
    | ConnectProtocolAction | ConnectProtocolRequestAction | ConnectProtocolSuccessAction | ConnectProtocolFailAction;

const initialState = fromJS({
    log: {},
    items: {},
    chat: [],
    connected: false
});

export const reducer: Reducer<IMap<string, any>> = (
    state: IMap<string, any> = initialState,
    action: KnownActions
): IMap<string, any> => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            let messages = state.get('chat');
            messages = messages.push(fromJS({
                id: action.id,
                message: action.message,
                user: action.user,
                date: new Date()
            }));
            return state.set('chat', messages);
        case 'REGISTER_BLOCK_ACTION':
            let actions = state.getIn(['log', action.blockId]);
            if (!actions) { actions = IList<any>(); }
            let act = fromJS({
                id: uuidv4(),
                payload: action.payload
            });
            actions = actions.push(act);
            return state.setIn(['log', action.blockId], actions);
        case 'CONNECT_PROTOCOL_SUCCESS':
            return state
                .set('protocol', action.payload)
                .set('connected', true);
        case 'CONNECT_PROTOCOL_REQUEST':
            return state.set('connected', false);
        case 'CONNECT_PROTOCOL_FAIL':
            return state.set('connected', false);
        default:
            return state;
    }
};

export const actionCreators = {
    registerBlock: (blockId: string, payload: any): AppThunkAction<KnownActions> => (dispatch, getState) => {
        dispatch({ type: 'REGISTER_BLOCK_ACTION', blockId, payload });
    },
    connectProtocol: (terminalId: string, user: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let currentProtocol = getState().blocks.get('protocol');
        if (currentProtocol) {
            currentProtocol.close();
        }

        dispatch({
            type: 'CONNECT_PROTOCOL',
            terminalId,
            user,
            payload: new Promise<any>(resolve => {
                try {
                    configureProtocol(
                        terminalId, user, dispatch, getState,
                        protocol => {
                            resolve(protocol);
                        }
                    );
                } catch (error) {
                    fail(error);
                }
            })
        });
    }
};

const configureProtocol = (
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
            actionLog: 'Map'
        }
    }).then((y) => {

        y.share.chat.observe(event => {
            if (event.type === 'insert') {
                for (let i = 0; i < event.length; i++) {
                    dispatch({
                        type: 'ADD_MESSAGE',
                        message: event.values[i].message,
                        user: event.values[i].user,
                        id: event.values[i].id
                    });
                }
            }
        });

        y.share.actionLog.observeDeep(event => {
            console.log('block event', event);
            if (event.type === 'add') {
                dispatch({
                    type: 'REGISTER_BLOCK_ACTION', blockId: event.name,
                    payload: { type: 'CREATE_BLOCK', data: JSON.stringify({ bid: event.name, time: Date.now() }) },
                });
                event.value.toArray().forEach(element => {
                    dispatch({ type: 'REGISTER_BLOCK_ACTION', blockId: event.name, payload: element });
                });
            } else if (event.type === 'insert') {
                event.values.forEach(element => {
                    dispatch({ type: 'REGISTER_BLOCK_ACTION', blockId: event.path[0], payload: element });
                });
            }
        });
        cb(y);
    });
};