import { Reducer } from 'redux';
import { List as IList, Record } from 'immutable';
import { AppThunkAction } from './appThunkAction';
import * as shortid from 'shortid';
import { configureProtocol } from 'pmpos-modules';

type SetChatProtocolAction = {
    type: 'SET_CHAT_PROTOCOL'
    protocol: any
};

type IncLamportAction = {
    type: 'INC_LAMPORT'
};

type ConnectProtocolAction = {
    type: 'CONNECT_PROTOCOL'
    terminalId: string
    user: string
    payload: Promise<any>
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

type KnownActions = SetChatProtocolAction | AddMessageAction | IncLamportAction
    | ConnectProtocolAction;

export const reducer: Reducer<StateRecord> = (
    state: StateRecord = new StateRecord(),
    action: KnownActions
): StateRecord => {
    switch (action.type) {
        case 'SET_CHAT_PROTOCOL':
            return state
                .set('protocol', action.protocol)
                .set('connected', true);
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
        default:
            return state;
    }
};

const configProtocol = (terminalId, networkName, user, dispatch) => {
    configureProtocol(
        terminalId, networkName, user,
        (chat, commit, config) => {
            dispatch({
                type: 'SET_CONFIG_PROTOCOL',
                protocol: config
            });
            dispatch({
                type: 'SET_COMMIT_PROTOCOL',
                protocol: commit
            });
            dispatch({
                type: 'SET_CHAT_PROTOCOL',
                protocol: chat
            });
        },
        messages =>
            messages.forEach(value =>
                dispatch({
                    type: 'ADD_MESSAGE',
                    time: value.time,
                    message: value.message,
                    user: value.user,
                    id: value.id,
                    lamport: value.lamport
                })),
        config => dispatch({
            type: 'CONFIG_RECEIVED',
            payload: config
        }),
        commits => dispatch({
            type: 'COMMIT_RECEIVED',
            values: commits
        })
    );
};

export const actionCreators = {
    addMessage: (message: string):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
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
            configProtocol(terminalId, networkName, user, dispatch);
        }
};