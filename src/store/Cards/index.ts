import { Reducer } from 'redux';
import { Map as IMap, List } from 'immutable';
import { AppThunkAction } from '../appThunkAction';
import { uuidv4 } from '../../lib/uuid';
import { ActionRecord, StateRecord, CardRecord, CardDataRecord, CommitRecord } from './models';
import { makeCard, makeState, makeAction, makeCardData, makeDeepCard, makeDeepCardData } from './makers';

type SetCommitProtocolAction = {
    type: 'SET_COMMIT_PROTOCOL',
    protocol: any
};

type CommitReceivedAction = {
    type: 'COMMIT_RECEIVED'
};

type AddCardAction = {
    type: 'ADD_CARD'
};

type CommitCardAction = {
    type: 'COMMIT_CARD'
};

type AddPendingActionAction = {
    type: 'ADD_PENDING_ACTION',
    action: ActionRecord
};

type LoadCardAction = {
    type: 'LOAD_CARD'
    cardId: String
    payload: Promise<CardDataRecord>
};

type LoadCardRequestAction = {
    type: 'LOAD_CARD_REQUEST'
};
type LoadCardSuccessAction = {
    type: 'LOAD_CARD_SUCCESS'
    payload: CardDataRecord
};
type LoadCardFailAction = {
    type: 'LOAD_DOCUMENT_FAIL'
};

type KnownActions = AddCardAction | AddPendingActionAction | CommitCardAction | CommitReceivedAction
    | LoadCardAction | LoadCardRequestAction | LoadCardSuccessAction | LoadCardFailAction
    | SetCommitProtocolAction;

const cardReducer = (
    state: CardRecord = makeCard(),
    action: ActionRecord
) => {
    switch (action.actionType) {
        case 'CREATE_CARD': {
            return makeCard({
                id: action.data.id,
                time: action.data.time,
                tags: IMap<string, string>()
            });
        }
        case 'SET_CARD_TAG': {
            return state.setIn(['tags', action.data.tagName], action.data.tagValue);
        }
        default:
            return state;
    }
};

export const reducer: Reducer<StateRecord> = (
    state: StateRecord = makeState(),
    action: KnownActions
) => {
    switch (action.type) {
        case 'ADD_PENDING_ACTION': {
            return state
                .updateIn(['currentCardData', 'card'], current => {
                    return cardReducer(current, action.action);
                })
                .update('pendingActions', list => list.push(action.action));
        }
        case 'ADD_CARD': {
            let cardCreateAction = makeAction({
                actionType: 'CREATE_CARD', data: {
                    id: uuidv4(),
                    time: new Date().getTime()
                }
            });
            return state
                .set('isLoaded', true)
                .set('pendingActions', state.pendingActions.clear().push(cardCreateAction))
                .setIn(['currentCardData', 'card'], cardReducer(undefined, cardCreateAction));
        }
        case 'SET_COMMIT_PROTOCOL': {
            return state.set('protocol', action.protocol);
        }
        case 'COMMIT_RECEIVED': {
            return state.update('cards', list => {
                return List<CardRecord>(state.protocol.keys().map(key => {
                    return makeDeepCard(state.protocol.get(key).card);
                }));
            });
        }
        case 'COMMIT_CARD': {
            return resetCurrentCard(state);
        }
        case 'LOAD_CARD_REQUEST': {
            return resetCurrentCard(state);
        }
        case 'LOAD_CARD_SUCCESS': {
            let result = state
                .set('currentCardData', action.payload)
                .set('isLoaded', true);
            return result;
        }
        case 'LOAD_DOCUMENT_FAIL': {
            return state
                .set('isLoaded', false);
        }
        default:
            return state;
    }
};

function resetCurrentCard(state: StateRecord) {
    return state
        .set('currentCardData', makeCardData())
        .set('pendingActions', state.pendingActions.clear())
        .set('isLoaded', false);
}

export const actionCreators = {
    addCard: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
        dispatch({
            type: 'ADD_CARD'
        });
    },
    commitCard: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
        dispatch({
            type: 'COMMIT_CARD'
        });
    },
    executeCardAction: (actionType: string, data: any):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            let actionData = makeAction({
                actionType, data
            });
            dispatch({
                type: 'ADD_PENDING_ACTION', action: actionData
            });
        },
    loadCard: (id: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        dispatch({
            type: 'LOAD_CARD',
            cardId: id,
            payload: new Promise<CardDataRecord>(resolve => {
                let cardData = makeDeepCardData(getState().cards.protocol.get(id));
                let cardActions = cardData.commits.flatMap((x: CommitRecord) => x.actions);
                let card = cardActions.reduce(
                    (c: CardRecord, action: ActionRecord) => cardReducer(c, action),
                    makeCard());
                cardData = cardData.set('card', card);
                resolve(cardData);
            })
        });
    }
};