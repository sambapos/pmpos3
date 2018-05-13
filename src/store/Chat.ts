import { Reducer } from 'redux';
import { List as IList, Record } from 'immutable';
import { IAppThunkAction } from './appThunkAction';
import * as shortid from 'shortid';

interface ISetChatProtocolAction {
    type: 'SET_CHAT_PROTOCOL'
    protocol: any
}

interface IIncLamportAction {
    type: 'INC_LAMPORT'
}

interface IAddMessageAction {
    type: 'ADD_MESSAGE'
    id: string
    user: string
    message: string
    time: number,
    lamport: number
}

export interface IMessage {
    id: string;
    message: string;
    user: string;
    time: number;
    lamport: number;
}

interface IState {
    protocol: any;
    messages: IList<IMessage>;
    connected: boolean;
    lamport: number;
}

export class StateRecord extends Record<IState>({
    protocol: undefined,
    messages: IList<IMessage>(),
    connected: false,
    lamport: 1
}) { }

type KnownActions = ISetChatProtocolAction | IAddMessageAction | IIncLamportAction;
// | ConnectProtocolAction;

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

export const actionCreators = {
    addMessage: (message: string):
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({ type: 'INC_LAMPORT' });
            getState().chat.protocol.push([{
                id: shortid.generate(),
                time: new Date().getTime(),
                lamport: getState().chat.lamport,
                message,
                user: getState().client.loggedInUser
            }]);
        }
};