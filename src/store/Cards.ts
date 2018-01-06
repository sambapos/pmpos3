import { Reducer } from 'redux';
import { AppThunkAction } from './appThunkAction';
import * as shortid from 'shortid';
import { CardRecord } from '../models/Card';
import { ActionRecord } from '../models/Action';
import { Commit, CommitRecord } from '../models/Commit';
import CardList from '../modules/CardList';
import { List, Map as IMap, Record } from 'immutable';

export interface State {
    cards: IMap<string, CardRecord>;
    currentCard: CardRecord;
    visibleCardId: string;
    currentCommits: List<CommitRecord> | undefined;
    pendingActions: List<ActionRecord>;
    isLoaded: boolean;
    protocol: any;
}

export class StateRecord extends Record<State>({
    currentCard: new CardRecord(),
    visibleCardId: '',
    pendingActions: List<ActionRecord>(),
    currentCommits: List<CommitRecord>(),
    cards: IMap<string, CardRecord>(),
    isLoaded: false,
    protocol: undefined
}) { }

type SetCommitProtocolAction = {
    type: 'SET_COMMIT_PROTOCOL',
    protocol: any
};

type CommitReceivedAction = {
    type: 'COMMIT_RECEIVED',
    values: Commit[]
};

type AddCardAction = {
    type: 'ADD_CARD',
    parentCard?: CardRecord
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
    type: 'LOAD_CARD_FAIL'
};

type KnownActions = AddCardAction | AddPendingActionAction | CommitCardAction | CommitReceivedAction
    | LoadCardAction | LoadCardRequestAction | LoadCardSuccessAction | LoadCardFailAction
    | SetCommitProtocolAction;

export const reducer: Reducer<StateRecord> = (
    state: StateRecord = new StateRecord(),
    action: KnownActions
) => {
    switch (action.type) {
        case 'ADD_PENDING_ACTION': {
            return state
                .update('currentCard', current => {
                    return CardList.applyAction(current, action.action);
                })
                .update('pendingActions', list => list.push(action.action));
        }
        case 'ADD_CARD': {
            let cardCreateAction = new ActionRecord({
                actionType: 'CREATE_CARD',
                id: shortid.generate(),
                cardId: action.parentCard ? action.parentCard.id : undefined,
                data: {
                    id: shortid.generate(),
                    time: new Date().getTime()
                }
            });
            return state
                .set('isLoaded', true)
                .set('currentCommits', undefined)
                .set('pendingActions', state.pendingActions.clear().push(cardCreateAction))
                .set('visibleCardId', action.parentCard ? cardCreateAction.data.id : '')
                .set('currentCard', CardList.applyAction(action.parentCard, cardCreateAction));
        }
        case 'SET_COMMIT_PROTOCOL': {
            return state.set('protocol', action.protocol);
        }
        case 'COMMIT_RECEIVED': {
            CardList.addCommits(action.values);
            return state.set('cards', CardList.getCards());
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
                .set('currentCommits', CardList.getCommits(action.payload.id))
                .set('isLoaded', true);
            return result;
        }
        case 'LOAD_CARD_FAIL': {
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
        .set('visibleCardId', '')
        .set('pendingActions', state.pendingActions.clear())
        .set('currentCommits', undefined)
        .set('isLoaded', false);
}

export const actionCreators = {
    addCard: (parentCard?: CardRecord): AppThunkAction<KnownActions> => (dispatch, getState) => {
        dispatch({
            type: 'ADD_CARD',
            parentCard
        });
    },
    commitCard: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
        const state = getState().cards;

        if (state.pendingActions.count() > 0) {
            let commit = {
                id: shortid.generate(),
                time: new Date().getTime(),
                terminalId: getState().client.terminalId,
                user: getState().client.loggedInUser,
                cardId: state.currentCard.id,
                state: state.currentCard.toJS(),
                actions: state.pendingActions.toJS()
            };
            state.protocol.push([commit]);
        }

        dispatch({
            type: 'COMMIT_CARD'
        });
    },
    addPendingAction: (card: CardRecord | undefined, actionType: string, data: any):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            let c = card || getState().cards.currentCard;
            let actionData = new ActionRecord({
                id: shortid.generate(),
                cardId: c.id,
                actionType,
                data,
                concurrencyData: CardList.readConcurrencyData(actionType, c, data)
            });
            if (CardList.canApplyAction(c, actionData)) {
                dispatch({
                    type: 'ADD_PENDING_ACTION', action: actionData
                });
            }
        },
    loadCard: (id: string, id2?: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        dispatch({
            type: 'LOAD_CARD',
            cardId: id,
            payload: new Promise<CardRecord>((resolve, reject) => {
                let card = CardList.getCard(id);
                if (!card) {
                    reject(`${id} not found`);
                } else {
                    resolve(card);
                }
            })
        });
    }
};