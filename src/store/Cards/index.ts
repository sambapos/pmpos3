import { Reducer } from 'redux';
import { AppThunkAction } from '../appThunkAction';
import { uuidv4 } from '../../lib/uuid';
import { StateRecord, Commit } from './models';
import CommitList from './CommitList';
import { CardRecord } from '../../models/Card';
import { ActionRecord } from '../../models/Action';

type SetCommitProtocolAction = {
    type: 'SET_COMMIT_PROTOCOL',
    protocol: any
};

type CommitReceivedAction = {
    type: 'COMMIT_RECEIVED',
    values: Commit[]
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

type KnownActions = AddCardAction | AddPendingActionAction | CommitCardAction | CommitReceivedAction
    | LoadCardAction | LoadCardRequestAction | LoadCardSuccessAction | LoadCardFailAction
    | SetCommitProtocolAction;

const commitList = new CommitList();

export const reducer: Reducer<StateRecord> = (
    state: StateRecord = new StateRecord(),
    action: KnownActions
) => {
    switch (action.type) {
        case 'ADD_PENDING_ACTION': {
            return state
                .update('currentCard', current => {
                    return commitList.applyAction(current, action.action);
                })
                .update('pendingActions', list => list.push(action.action));
        }
        case 'ADD_CARD': {
            let cardCreateAction = new ActionRecord({
                actionType: 'CREATE_CARD', data: {
                    id: uuidv4(),
                    time: new Date().getTime()
                }
            });
            return state
                .set('isLoaded', true)
                .set('pendingActions', state.pendingActions.clear().push(cardCreateAction))
                .set('currentCard', commitList.applyAction(undefined, cardCreateAction));
        }
        case 'SET_COMMIT_PROTOCOL': {
            return state.set('protocol', action.protocol);
        }
        case 'COMMIT_RECEIVED': {
            commitList.addCommits(action.values);
            return state.set('cards', commitList.getCards());
        }
        case 'COMMIT_CARD': {
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
        .set('currentCard', new CardRecord())
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
        const state = getState().cards;

        if (state.pendingActions.count() > 0) {
            let commit = {
                id: uuidv4(),
                cardId: state.currentCard.id,
                state: state.currentCard.toJS(),
                actions: state.pendingActions
            };
            state.protocol.push([commit]);
        }

        dispatch({
            type: 'COMMIT_CARD'
        });
    },
    executeCardAction: (actionType: string, data: any):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            let actionData = new ActionRecord({
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
                resolve(commitList.getCard(id));
            })
        });
    }
};