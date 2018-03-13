import { Reducer } from 'redux';
import { List as IList, Record } from 'immutable';
import { AppThunkAction } from './appThunkAction';
import configureProtocol from './configureProtocol';
import * as shortid from 'shortid';

type IncLamportAction = {
    type: 'INC_LAMPORT'
};

type ConnectProtocolAction = {
    type: 'CONNECT_PROTOCOL'
    terminalId: string
    user: string
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
    time: number,
    lamport: number
};

export interface Message {
    id: string;
    message: string;
    user: string;
    time: number;
    lamport: number;
}

interface State {
    protocol: any;
    messages: IList<Message>;
    connected: boolean;
    lamport: number;
}

export class StateRecord extends Record<State>({
    protocol: undefined,
    messages: IList<Message>(),
    connected: false,
    lamport: 1
}) { }

type KnownActions = AddMessageAction | IncLamportAction
    | ConnectProtocolAction | ConnectProtocolSuccessAction | ConnectProtocolFailAction | ConnectProtocolRequestAction;

export const reducer: Reducer<StateRecord> = (
    state: StateRecord = new StateRecord(),
    action: KnownActions
): StateRecord => {
    switch (action.type) {
        case 'INC_LAMPORT':
            return state.set('lamport', state.lamport);
        case 'ADD_MESSAGE':
            state = state.set('lamport', Math.max(state.lamport, action.lamport) + 1);
            return state.update('messages', list => {
                return list.push({
                    id: action.id,
                    message: action.message,
                    user: action.user,
                    time: action.time,
                    lamport: action.lamport
                });
            });
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
    addMessage: (message: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        dispatch({ type: 'INC_LAMPORT' });
        getState().chat.protocol.share.chat.push([{
            id: shortid.generate(),
            time: new Date().getTime(),
            lamport: getState().chat.lamport,
            message: message,
            user: getState().client.loggedInUser
        }]);
    },
    connectProtocol: (terminalId: string, networkName: string, user: string):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            let currentProtocol = getState().cards.protocol;
            if (currentProtocol) {
                return;
            }

            dispatch({
                type: 'CONNECT_PROTOCOL',
                terminalId,
                user,
                payload: new Promise<any>((resolve, reject) => {
                    try {
                        configureProtocol(
                            terminalId, networkName, user,
                            dispatch, getState,
                            protocol => {
                                resolve(protocol);
                            }
                        );
                    } catch (error) {
                        reject(error);
                    }
                })
            });
        }
};