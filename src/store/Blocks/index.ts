import Y from 'yjs/dist/y';
import { Reducer } from 'redux';
import { Map as IMap, List as IList, fromJS } from 'immutable';
import { AppThunkAction } from '../appThunkAction';
import { uuidv4 } from '../../lib/uuid';
import { fail } from 'assert';
import configureProtocol from './configureProtocol';
import objectify from './objectify';
import { KnownActions } from './KnownActions';

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
                date: action.date
            }));
            return state.set('chat', messages);
        case 'REGISTER_BLOCK_ACTION':
            let actions = state.getIn(['log', action.blockId]);
            if (!actions) { actions = IList<any>(); }
            actions = actions.push(IMap(action.payload));
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
    addMessage: (message: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        getState().blocks.get('protocol').share.chat.push([{
            id: uuidv4(),
            date: Date.now(),
            message: message,
            user: getState().client.loggedInUser
        }]);
    },
    registerBlock: (
        type: string,
        blockId: string,
        data: string
    ): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let actionLog = getState().blocks.get('protocol').share.actionLog;
        console.log('action_log', actionLog);

        let bid = blockId;
        if (type === 'CREATE_BLOCK') {
            bid = uuidv4();
            data = 'bid:' + bid;
        }

        let actions = actionLog.get(bid);
        console.log('log', actions);

        if (!actions) {
            actionLog.set(bid, Y.Array);
            actions = actionLog.get(bid);
        }
        actions.push([{
            id: uuidv4(),
            time: Date.now(),
            blockId: bid,
            type: type,
            data: objectify(data)
        }]);

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