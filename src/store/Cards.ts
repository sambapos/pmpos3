import { Reducer } from 'redux';
import { AppThunkAction } from './appThunkAction';
import { CardList, cardOperations, CardsManager, DataBuilder } from 'pmpos-modules';
import { List, Record } from 'immutable';
import { CardRecord, CardTypeRecord, ActionRecord, Commit, CardTag } from 'pmpos-models';
import OperationEditor from '../modules/OperationEditor';

export interface State {
    cards: List<CardRecord>;
    currentCard: CardRecord;
    currentCardType: CardTypeRecord;
    protocol: any;
    cardListScrollTop: number;
    searchValue: string;
    showAllCards: boolean;
    failed: boolean;
    tabIndex: number;
    closeCardRequested: boolean;
}

export class StateRecord extends Record<State>({
    currentCard: new CardRecord(),
    currentCardType: new CardTypeRecord(),
    cards: List<CardRecord>(),
    protocol: undefined,
    cardListScrollTop: 0,
    searchValue: '',
    showAllCards: false,
    failed: false,
    tabIndex: 0,
    closeCardRequested: false
}) { }

type SetCommitProtocolAction = {
    type: 'SET_COMMIT_PROTOCOL'
    protocol: any
};

type CommitReceivedAction = {
    type: 'COMMIT_RECEIVED'
    values: Commit[]
};

type CommitReceivedSuccessAction = {
    type: 'COMMIT_RECEIVED_SUCCESS'
};

type CommitCardAction = {
    type: 'COMMIT_CARD'
};

type RequestCloseCardAction = {
    type: 'REQUEST_CLOSE_CARD'
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

type SetTabIndexAction = {
    type: 'SET_TAB_INDEX',
    value: number
};

type SetCurrentCard = {
    type: 'SET_CURRENT_CARD',
    card: CardRecord
};

type KnownActions = CommitCardAction | RequestCloseCardAction
    | CommitReceivedAction | CommitReceivedSuccessAction | SetCurrentCard
    | SetCommitProtocolAction | SetCurrentCardTypeAction | SetCardListScrollTopAction |
    SetSearchValueAction | SetShowAllCardsAction | SetTabIndexAction;

export const reducer: Reducer<StateRecord> = (
    state: StateRecord = new StateRecord(),
    action: KnownActions
) => {
    switch (action.type) {
        case 'SET_COMMIT_PROTOCOL': {
            return state.set('protocol', action.protocol);
        }
        case 'COMMIT_RECEIVED': {
            CardList.addCommits(action.values);
            return state.set('cards', CardList.getCardsByType(state.currentCardType.id));
        }
        case 'COMMIT_RECEIVED_SUCCESS': {
            return state.set('cards', CardList.getCardsByType(state.currentCardType.id));
        }
        case 'COMMIT_CARD': {
            return resetCurrentCard(state);
        }
        case 'REQUEST_CLOSE_CARD': {
            return state.set('closeCardRequested', true);
        }
        case 'SET_CURRENT_CARD_TYPE': {
            return state
                .set('cards', CardList.getCardsByType(action.cardType.id))
                .set('currentCardType', action.cardType)
                .set('tabIndex', 0);
        }
        case 'SET_CARD_LIST_SCROLL_TOP': {
            return state.set('cardListScrollTop', action.value);
        }
        case 'SET_SEARCH_VALUE': {
            return state.set('searchValue', action.value);
        }
        case 'SET_SHOW_ALL_CARDS': {
            return state
                .set('showAllCards', action.value)
                .set('cardListScrollTop', 0);
        }
        case 'SET_TAB_INDEX': {
            return state.set('tabIndex', action.value);
        }
        case 'SET_CURRENT_CARD': {
            return state
                .set('currentCard', action.card)
                .set('closeCardRequested', false);
        }
        default:
            return state;
    }
};

function resetCurrentCard(state: StateRecord) {
    return state
        .set('currentCard', new CardRecord())
        .set('failed', false)
        .set('closeCardRequested', false);
}

export const actionCreators = {
    addCard: (cardType: CardTypeRecord, tags: CardTag[])
        : AppThunkAction<KnownActions> => (dispatch, getState) => {
            CardsManager.createCard('', cardType.reference, tags)
                .then(card =>
                    dispatch({
                        type: 'SET_CURRENT_CARD',
                        card
                    })
                );
        },
    addPendingAction: (card: CardRecord | undefined, actionType: string, data: any):
        AppThunkAction<any> => (dispatch, getState) => {
            let c = card || getState().cards.currentCard;
            const handleCanEdit = actionRecord => cardOperations.canEdit(actionRecord);
            const handleEdit = (action) => {
                return new Promise<ActionRecord>((resolve, reject) => {
                    let editor = OperationEditor.getEditor(
                        action.actionType,
                        c,
                        (at, d) => {
                            dispatch({ type: 'SET_MODAL_STATE', visible: false });
                            let result = action.set('data', d);
                            resolve(result);
                        },
                        () => {
                            dispatch({ type: 'SET_MODAL_STATE', visible: false });
                            reject();
                        },
                        action.data);
                    dispatch({ type: 'SET_MODAL_COMPONENT', component: editor });
                });
            };
            const handleClose = () => {
                dispatch({ type: 'REQUEST_CLOSE_CARD' });
            };

            CardsManager.executeAction(
                '', c.id, actionType, data, handleCanEdit, handleEdit, handleClose)
                .then(result =>
                    dispatch({
                        type: 'SET_CURRENT_CARD',
                        card: result
                    })
                );
        },
    removePendingActions: (cardId: string):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            let card = CardsManager.removePendingActions('', '', cardId);
            dispatch({
                type: 'SET_CURRENT_CARD',
                card
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
        let card = CardsManager.openCard('', id);
        dispatch({
            type: 'SET_CURRENT_CARD',
            card
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
        },
    setTabIndex: (value: number):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({ type: 'SET_TAB_INDEX', value });
        },
    createFakeCustomers: ():
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            const db = new DataBuilder();
            db.createFakeCustomers(getState().cards.protocol);
        },
    createFakeProducts: ():
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            const db = new DataBuilder();
            db.createFakeProducts(getState().cards.protocol);
        }
};