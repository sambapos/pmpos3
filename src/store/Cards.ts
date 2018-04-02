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
import { ActionState } from '../models/ActionState';
import { ApplicationState } from '.';

export interface State {
    cards: List<CardRecord>;
    currentCard: CardRecord;
    currentCardType: CardTypeRecord;
    currentCommits: List<CommitRecord> | undefined;
    pendingActions: List<ActionRecord>;
    isLoaded: boolean;
    protocol: any;
    cardListScrollTop: number;
    searchValue: string;
    showAllCards: boolean;
    failed: boolean;
}

export class StateRecord extends Record<State>({
    currentCard: new CardRecord(),
    currentCardType: new CardTypeRecord(),
    pendingActions: List<ActionRecord>(),
    currentCommits: List<CommitRecord>(),
    cards: List<CardRecord>(),
    isLoaded: false,
    protocol: undefined,
    cardListScrollTop: 0,
    searchValue: '',
    showAllCards: false,
    failed: false
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

type SetCardListScrollTopAction = {
    type: 'SET_CARD_LIST_SCROLL_TOP'
    value: number
};

type SetSearchValueAction = {
    type: 'SET_SEARCH_VALUE',
    value: string
};

type SetShowAllCardsAction = {
    type: 'SET_SHOW_ALL_CARDS',
    value: boolean
};

type KnownActions = AddPendingActionAction | CommitCardAction | CommitReceivedAction
    | LoadCardAction | LoadCardRequestAction | LoadCardSuccessAction | LoadCardFailAction
    | SetCommitProtocolAction | SetCurrentCardTypeAction | SetCardListScrollTopAction |
    SetSearchValueAction | SetShowAllCardsAction;

function getEditor(action: ActionRecord, observer: any): Promise<ActionRecord> {
    return new Promise<ActionRecord>((resolve, reject) => {
        let editor = cardOperations.getEditor(
            action, (actionType, data) => {
                observer.next({ type: 'SET_MODAL_STATE', visible: false });
                let result = action.set('data', data);
                resolve(result);
            },
            () => {
                observer.next({ type: 'SET_MODAL_STATE', visible: false });
                reject();
            },
            action.data);
        observer.next({ type: 'SET_MODAL_COMPONENT', component: editor });
    });
}

async function getResult(actionState: ActionState, action: ActionRecord, observer: any) {
    action = action.set('data', cardOperations.fixData(action.actionType, { ...action.data }));
    if (cardOperations.canEdit(action)) {
        let result = await getEditor(action, observer);
        return { type: 'ADD_PENDING_ACTION', action: result, initialize: false };
    } else { return { type: 'ADD_PENDING_ACTION', action, initialize: false }; }
}

async function createObserver(actionState: ActionState, actions: ActionRecord[], observer: any) {
    for (const action of actions) {
        let result = await getResult(actionState, action, observer);
        observer.next(result);
    }
}

export const epic = (
    action$: ActionsObservable<AddPendingActionAction>,
    store: { getState: Function, dispatch: Function }): Observable<AddPendingActionAction> =>
    action$.ofType('ADD_PENDING_ACTION')
        .mergeMap(async action => {
            let root = store.getState().cards.currentCard as CardRecord;
            let cardId = action.action.actionType === 'CREATE_CARD'
                ? action.action.data.id : action.action.cardId;
            let card = root.getCard(cardId) || root;
            let actions = await RuleManager.getNextActions(
                action.action.actionType,
                action.action.data,
                action.action.cardId,
                root, card);
            return Observable.create(observer =>
                createObserver({ root, card, action: action.action }, actions, observer)
                    .then(() => observer.complete())
                    .catch(() => observer.complete()));
        })
        .mergeMap(x => x);

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
                .set('isLoaded', false)
                .set('failed', true);
        }
        case 'SET_CURRENT_CARD_TYPE': {
            return state
                .set('cards', CardList.getCardsByType(action.cardType.id))
                .set('currentCardType', action.cardType);
        }
        case 'SET_CARD_LIST_SCROLL_TOP': {
            return state.set('cardListScrollTop', action.value);
        }
        case 'SET_SEARCH_VALUE': {
            return state.set('searchValue', action.value);
        }
        case 'SET_SHOW_ALL_CARDS': {
            return state.set('showAllCards', action.value);
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
        .set('isLoaded', false)
        .set('failed', false);
}

function createAndPostCommit(state: ApplicationState, card: CardRecord, actions: List<ActionRecord>) {
    let commit = {
        id: shortid.generate(),
        time: new Date().getTime(),
        terminalId: state.client.terminalId,
        user: state.client.loggedInUser,
        cardId: card.id,
        state: card.toJS(),
        actions: actions.toJS()
    };
    state.cards.protocol.push([commit]);
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
    postCommit: (card: CardRecord, actions: List<ActionRecord>):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            createAndPostCommit(getState(), card, actions);
        },
    commitCard: (): AppThunkAction<KnownActions> => (dispatch, getState) => {
        const state = getState().cards;

        if (state.pendingActions.count() > 0) {
            let processedActions = state.pendingActions.map(a => cardOperations.processPendingAction(a));
            createAndPostCommit(getState(), state.currentCard, processedActions);
        }

        dispatch({
            type: 'COMMIT_CARD'
        });
    },

    deleteCards: (cardTypeId: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let cards = CardList.getCardsByType(cardTypeId);
        let state = getState().cards;
        for (let index = state.protocol.length - 1; index >= 0; index--) {
            const element = state.protocol.get(index);
            let card = cards.find(c => c.id === element.cardId);
            if (card) {
                state.protocol.delete(index);
                CardList.cards = CardList.cards.remove(card.id);
            }
        }
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
        },
    setCardListScrollTop: (value: number):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({ type: 'SET_CARD_LIST_SCROLL_TOP', value });
        },
    setSearchValue: (value: string):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({ type: 'SET_SEARCH_VALUE', value });
        },
    setShowAllCards: (value: boolean):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({ type: 'SET_SHOW_ALL_CARDS', value });
        }
};