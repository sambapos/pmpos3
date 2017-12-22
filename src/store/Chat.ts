import { Reducer } from 'redux';
import { List, fromJS } from 'immutable';
import { AppThunkAction } from './appThunkAction';
import { uuidv4 } from './uuid';

type AddMessageAction = {
    type: 'ADD_MESSAGE',
    message: string
};

type ClearMessagesAction = {
    type: 'CLEAR_MESSAGES'
};

type KnownActions = AddMessageAction | ClearMessagesAction;

export const reducer: Reducer<List<Map<any, any>>> = (
    state: List<Map<any, any>> = List<Map<any, any>>(),
    action: KnownActions
): List<Map<any, any>> => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return state.push(fromJS({
                id: uuidv4(),
                message: action.message,
                date: new Date()
            }));
        case 'CLEAR_MESSAGES':
            return state.clear();
        default:
            return state;
    }
};

export const actionCreators = {
    addMessage: (message: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        dispatch({ type: 'ADD_MESSAGE', message });
    },
    clearMesssages: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
        dispatch({ type: 'CLEAR_MESSAGES' });
    }
};