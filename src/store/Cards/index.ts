import { Reducer } from 'redux';
import { Map as IMap, List } from 'immutable';
import { AppThunkAction } from '../appThunkAction';
import { uuidv4 } from '../../lib/uuid';
import { ActionRecord, StateRecord, CardDataRecord, CommitRecord, CardRecord } from './models';
import { makeCard, makeState, makeAction, makeCommit, makeCardData } from './makers';

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
    payload: Promise<CardRecord>
};

type LoadCardRequestAction = {
    type: 'LOAD_CARD_REQUEST'
};
type LoadCardSuccessAction = {
    type: 'LOAD_CARD_SUCCESS'
    payload: CardRecord
};
type LoadCardFailAction = {
    type: 'LOAD_DOCUMENT_FAIL'
};

type KnownActions = AddCardAction | AddPendingActionAction | CommitCardAction
    | LoadCardAction | LoadCardRequestAction | LoadCardSuccessAction | LoadCardFailAction;

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
                .update('currentCard', current => {
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
                .set('currentCard', cardReducer(undefined, cardCreateAction));
        }
        case 'COMMIT_CARD': {
            let actions = state.pendingActions;
            if (actions.count() === 0) {
                return resetCurrentCard(state);
            }
            let card = state.currentCard;
            let commit = makeCommit({
                state: card,
                actions: actions
            });
            let cardData = state.getIn(['cardDataMap', card.id]) as CardDataRecord ||
                makeCardData({
                    card, commits: List<CommitRecord>()
                });
            cardData = cardData
                .set('card', card)
                .update('commits', list => list.push(commit));
            state = state
                .setIn(['cardDataMap', card.id], cardData);
            return resetCurrentCard(state);
        }
        case 'LOAD_CARD_REQUEST': {
            return resetCurrentCard(state);
        }
        case 'LOAD_CARD_SUCCESS': {
            let result = state
                .set('currentCard', action.payload)
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
        .set('currentCard', makeCard())
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
            payload: new Promise<CardRecord>(resolve => {
                let card = getState().cards.cardDataMap.getIn([id, 'card']);
                resolve(card);
            })
        });
    }
};