import { Reducer } from 'redux';
import { Map as IMap, List } from 'immutable';
import { AppThunkAction } from '../appThunkAction';
import { uuidv4 } from '../../lib/uuid';
import { CardRecord, makeCard, Card } from '../../models/Card';
import { TypedRecord } from 'typed-immutable-record/dist/src/typed.record';
import { makeTypedFactory } from 'typed-immutable-record/dist/src/typed.factory';

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

interface Action {
    actionType: string;
    data: any;
}

interface ActionRecord extends TypedRecord<ActionRecord>, Action { }

const makeAction = makeTypedFactory<Action, ActionRecord>({
    actionType: '',
    data: {}
});

interface Commit {
    state: CardRecord;
    actions: List<ActionRecord>;
}

interface CommitRecord extends TypedRecord<CommitRecord>, Commit { }

const makeCommit = makeTypedFactory<Commit, CommitRecord>({
    state: makeCard(),
    actions: List<ActionRecord>()
});

interface CardData {
    card: CardRecord;
    commits: List<CommitRecord>;
}

interface CardDataRecord extends TypedRecord<CardDataRecord>, CardData { }

const makeCardData = makeTypedFactory<CardData, CardDataRecord>({
    card: makeCard(),
    commits: List<CommitRecord>()
});

interface State {
    cardDataMap: IMap<string, CardDataRecord>;
    currentCard: CardRecord;
    pendingActions: List<ActionRecord>;
    isLoaded: boolean;
}

export interface StateRecord extends TypedRecord<StateRecord>, State { }

const makeState = makeTypedFactory<State, StateRecord>({
    cardDataMap: IMap<string, CardDataRecord>(),
    currentCard: makeCard(),
    pendingActions: List<ActionRecord>(),
    isLoaded: false
});

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
            let card = state.get('currentCard') as CardRecord;
            let commit = makeCommit({
                state: card,
                actions: state.get('pendingActions')
            });
            let cardData = state.getIn(['cardDataMap', card.id]) as CardDataRecord ||
                makeCardData({
                    card, commits: List<CommitRecord>()
                });
            cardData = cardData
                .set('card', card)
                .update('commits', list => list.push(commit));
            return state
                .set('isLoaded', false)
                .set('pendingActions', state.pendingActions.clear())
                .set('currentCard', makeCard())
                .setIn(['cardDataMap', card.id], cardData);
        }
        case 'LOAD_CARD_REQUEST': {
            return state
                .set('currentCard', makeCard())
                .set('pendingActions', state.pendingActions.clear())
                .set('isLoaded', false);
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
    executeCardAction: (actionType: string, data: string):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            let actionData = makeAction({
                actionType, data: JSON.parse(data)
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