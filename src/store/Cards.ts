import 'rxjs';
import { Reducer } from 'redux';
import { AppThunkAction } from './appThunkAction';
import * as shortid from 'shortid';
import { CardRecord } from '../models/Card';
import { ActionRecord } from '../models/Action';
import { Commit, CommitRecord } from '../models/Commit';
import CardList from '../modules/CardList';
import RuleManager from '../modules/RuleManager';
import { List, Record } from 'immutable';
import { CardTypeRecord } from '../models/CardType';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { cardOperations } from '../modules/CardOperations/index';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';

export interface State {
    cards: List<CardRecord>;
    currentCard: CardRecord;
    currentCardType: CardTypeRecord;
    currentCommits: List<CommitRecord> | undefined;
    pendingActions: List<ActionRecord>;
    isLoaded: boolean;
    protocol: any;
}

export class StateRecord extends Record<State>({
    currentCard: new CardRecord(),
    currentCardType: new CardTypeRecord(),
    pendingActions: List<ActionRecord>(),
    currentCommits: List<CommitRecord>(),
    cards: List<CardRecord>(),
    isLoaded: false,
    protocol: undefined
}) { }

type SetCommitProtocolAction = {
    type: 'SET_COMMIT_PROTOCOL'
    protocol: any
};

type CommitReceivedAction = {
    type: 'COMMIT_RECEIVED'
    values: Commit[]
};

type CommitCardAction = {
    type: 'COMMIT_CARD'
};

type AddPendingActionAction = {
    type: 'ADD_PENDING_ACTION'
    action: ActionRecord,
    initialize: boolean
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

type SetCurrentCardTypeAction = {
    type: 'SET_CURRENT_CARD_TYPE'
    cardType: CardTypeRecord
};

type KnownActions = AddPendingActionAction | CommitCardAction | CommitReceivedAction
    | LoadCardAction | LoadCardRequestAction | LoadCardSuccessAction | LoadCardFailAction
    | SetCommitProtocolAction | SetCurrentCardTypeAction;

// function processArray(
//     array: ActionRecord[],
//     fn: (action: ActionRecord, dispatch: Function) => Promise<ActionRecord>,
//     dispatch: Function) {
//     var results: ActionRecord[] = [];
//     return array.reduce(
//         (p: Promise<ActionRecord[]>, item: ActionRecord) => {
//             return p.then(function () {
//                 return fn(item, dispatch).then(function (action: ActionRecord) {
//                     results.push(action);
//                     return results;
//                 });
//             });
//         },
//         new Promise<ActionRecord[]>(r => r()));
// }

// const processActions = (actions: ActionRecord[], dispatch: Function): Promise<ActionRecord[]> => {
//     if (actions.length === 0) {
//         return new Promise<ActionRecord[]>(r => r(actions));
//     }
//     return new Promise<ActionRecord[]>((resolve, reject) => {
//         processArray(actions, processAction, dispatch).then(
//             (result: ActionRecord[]) => resolve(result),
//             (reason: string) => reject(reason));
//     });
// };

export const epic = (
    action$: ActionsObservable<AddPendingActionAction>,
    store: { getState: Function, dispatch: Function }): Observable<AddPendingActionAction> =>
    action$.ofType('ADD_PENDING_ACTION')
        .mergeMap(action => {
            let root = store.getState().cards.currentCard;
            let cardId = action.action.actionType === 'CREATE_CARD'
                ? action.action.data.id : action.action.cardId;
            let card = root.getCard(cardId) || root;
            return RuleManager.getNextActions(action.action, root, card);
        })
        .mergeMap(x => ArrayObservable.create(x))
        .mergeMap(action => {
            return new Promise<ActionRecord>((resolve, reject) => {
                if (cardOperations.canEdit(action)) {
                    let editor = cardOperations
                        .getEditor(
                        action, (actionType, data) => {
                            let result = action.set('data', data);
                            resolve(result);
                        },
                        () => reject(), action.data);
                    store.dispatch({ type: 'SET_MODAL_COMPONENT', component: editor });
                } else {
                    console.log('Edit not needed', action);
                    resolve(action);
                }
            });
        })
        .mergeMap(action => Observable.of(
            { type: 'ADD_PENDING_ACTION', action, initialize: false } as AddPendingActionAction));

export const reducer: Reducer<StateRecord> = (
    state: StateRecord = new StateRecord(),
    action: KnownActions
) => {
    switch (action.type) {
        case 'ADD_PENDING_ACTION': {
            let currentState = action.initialize
                ? state
                    .set('currentCard', new CardRecord())
                    .set('isLoaded', true)
                    .set('currentCommits', undefined)
                    .set('pendingActions', state.pendingActions.clear())
                : state;
            return currentState
                .update('currentCard', current => CardList.applyAction(current, action.action))
                .update('pendingActions', list => list.push(action.action));
        }
        case 'SET_COMMIT_PROTOCOL': {
            return state.set('protocol', action.protocol);
        }
        case 'COMMIT_RECEIVED': {
            CardList.addCommits(action.values);
            return state.set('cards', CardList.getCardsByType(state.currentCardType.id));
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
        case 'SET_CURRENT_CARD_TYPE': {
            return state
                .set('cards', CardList.getCardsByType(action.cardType.id))
                .set('currentCardType', action.cardType);
        }
        default:
            return state;
    }
};

function resetCurrentCard(state: StateRecord) {
    return state
        .set('currentCard', new CardRecord())
        .set('pendingActions', state.pendingActions.clear())
        .set('currentCommits', undefined)
        .set('isLoaded', false);
}

export const actionCreators = {
    addCard: (cardType: CardTypeRecord): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let cardCreateAction = new ActionRecord({
            actionType: 'CREATE_CARD',
            id: shortid.generate(),
            data: {
                id: shortid.generate(),
                typeId: cardType.id,
                type: cardType.name,
                time: new Date().getTime()
            }
        });
        dispatch({
            type: 'ADD_PENDING_ACTION',
            action: cardCreateAction,
            initialize: true
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
                    type: 'ADD_PENDING_ACTION', action: actionData, initialize: false
                });
            }
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
    loadCard: (id: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
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
    },
    setCurrentCardType: (cardType: CardTypeRecord | undefined):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            if (cardType) {
                dispatch({
                    type: 'SET_CURRENT_CARD_TYPE',
                    cardType
                });
            }
        }
};