import { Reducer } from 'redux';
import { Map as IMap, List as IList, fromJS } from 'immutable';
import { AppThunkAction } from './appThunkAction';
import { uuidv4 } from './uuid';

type RegisterBlockActionAction = {
    type: 'REGISTER_BLOCK_ACTION',
    id: string,
    payload: any
};

type KnownActions = RegisterBlockActionAction;

export const reducer: Reducer<IMap<string, IList<any>>> = (
    state: IMap<string, IList<any>> = IMap<string, IList<any>>(),
    action: KnownActions
): IMap<string, IList<any>> => {
    switch (action.type) {
        case 'REGISTER_BLOCK_ACTION':
            let actions = state.get(action.id);
            if (!actions) { actions = IList<any>(); }
            let act = fromJS({
                id: uuidv4(),
                payload: action.payload
            });
            actions = actions.push(act);
            return state.set(action.id, actions);
        default:
            return state;
    }
};

export const actionCreators = {
    registerBlock: (id: string, payload: any): AppThunkAction<KnownActions> => (dispatch, getState) => {
        dispatch({ type: 'REGISTER_BLOCK_ACTION', id, payload });
    }
};