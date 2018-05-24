import { Reducer } from 'redux';
import { IAppThunkAction } from './appThunkAction';
import {
    CardManager, cardOperations, TerminalManager, DataBuilder,
    CardRecord, CardTypeRecord, ActionRecord, ICommit, ICardTag
} from 'pmpos-core';
import { List, Record } from 'immutable';
import OperationEditor from '../modules/OperationEditor';

export interface IState {
    cards: List<CardRecord>;
    currentCard: CardRecord;
    currentCardType: CardTypeRecord;
    cardListScrollTop: number;
    searchValue: string;
    showAllCards: boolean;
    failed: boolean;
    tabIndex: number;
    closeCardRequested: boolean;
}

export class StateRecord extends Record<IState>({
    currentCard: new CardRecord(),
    currentCardType: new CardTypeRecord(),
    cards: List<CardRecord>(),
    cardListScrollTop: 0,
    searchValue: '',
    showAllCards: false,
    failed: false,
    tabIndex: 0,
    closeCardRequested: false
}) { }

interface ISetCommitProtocolAction {
    type: 'SET_COMMIT_PROTOCOL'
    protocol: any
}

interface ICommitReceivedAction {
    type: 'COMMIT_RECEIVED'
    values: ICommit[]
}

interface ICommitReceivedSuccessAction {
    type: 'COMMIT_RECEIVED_SUCCESS'
};

interface ICommitCardAction {
    type: 'COMMIT_CARD'
}

interface IRequestCloseCardAction {
    type: 'REQUEST_CLOSE_CARD'
}

interface ISetCurrentCardTypeAction {
    type: 'SET_CURRENT_CARD_TYPE'
    cardType: CardTypeRecord
}

interface ISetCardListScrollTopAction {
    type: 'SET_CARD_LIST_SCROLL_TOP'
    value: number
}

interface ISetSearchValueAction {
    type: 'SET_SEARCH_VALUE',
    value: string
}

interface ISetShowAllCardsAction {
    type: 'SET_SHOW_ALL_CARDS',
    value: boolean
}

interface ISetTabIndexAction {
    type: 'SET_TAB_INDEX',
    value: number
}

interface ISetCurrentCard {
    type: 'SET_CURRENT_CARD',
    card: CardRecord
}

type KnownActions = ICommitCardAction | IRequestCloseCardAction
    | ICommitReceivedAction | ICommitReceivedSuccessAction | ISetCurrentCard
    | ISetCommitProtocolAction | ISetCurrentCardTypeAction | ISetCardListScrollTopAction |
    ISetSearchValueAction | ISetShowAllCardsAction | ISetTabIndexAction;

export const reducer: Reducer<StateRecord> = (
    state: StateRecord = new StateRecord(),
    action: KnownActions
) => {
    switch (action.type) {
        case 'COMMIT_RECEIVED': {
            CardManager.addCommits(action.values);
            return state.set('cards', CardManager.getCardsByType(state.currentCardType.id));
        }
        case 'COMMIT_RECEIVED_SUCCESS': {
            return state.set('cards', CardManager.getCardsByType(state.currentCardType.id));
        }
        case 'COMMIT_CARD': {
            return resetCurrentCard(state);
        }
        case 'REQUEST_CLOSE_CARD': {
            return state.set('closeCardRequested', true);
        }
        case 'SET_CURRENT_CARD_TYPE': {
            return state
                .set('cards', CardManager.getCardsByType(action.cardType.id))
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
    addCard: (cardType: CardTypeRecord, tags: ICardTag[]):
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            TerminalManager.createCard('', cardType.reference, tags)
                .then(card =>
                    dispatch({
                        type: 'SET_CURRENT_CARD',
                        card
                    })
                );
        },
    addPendingAction: (card: CardRecord | undefined, actionType: string, data: any):
        IAppThunkAction<any> => (dispatch, getState) => {
            const c = card || getState().cards.currentCard;
            const handleCanEdit = actionRecord => cardOperations.canEdit(actionRecord);
            const handleEdit = (action) => {
                return new Promise<ActionRecord>((resolve, reject) => {
                    const editor = OperationEditor.getEditor(
                        action.actionType,
                        c,
                        (at, d) => {
                            dispatch({ type: 'SET_MODAL_STATE', visible: false });
                            const result = action.set('data', d);
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

            TerminalManager.executeAction(
                '', getState().cards.currentCard.id, c.id, actionType, data, handleCanEdit, handleEdit, handleClose)
                .then(result =>
                    dispatch({
                        type: 'SET_CURRENT_CARD',
                        card: result
                    })
                );
        },
    removePendingActions: (cardId: string):
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            const card = TerminalManager.removePendingActions('', '', cardId);
            dispatch({
                type: 'SET_CURRENT_CARD',
                card
            });
        },
    deleteCards: (cardTypeId: string): IAppThunkAction<KnownActions> => (dispatch, getState) => {
        CardManager.deleteCards(cardTypeId);
    },
    loadCard: (id: string): IAppThunkAction<KnownActions> => (dispatch, getState) => {
        const card = TerminalManager.openCard('', id);
        dispatch({
            type: 'SET_CURRENT_CARD',
            card
        });
    },
    setCurrentCardType: (cardType: CardTypeRecord | undefined):
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            if (cardType) {
                dispatch({
                    type: 'SET_CURRENT_CARD_TYPE',
                    cardType
                });
            }
        },
    setCardListScrollTop: (value: number):
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({ type: 'SET_CARD_LIST_SCROLL_TOP', value });
        },
    setSearchValue: (value: string):
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({ type: 'SET_SEARCH_VALUE', value });
        },
    setShowAllCards: (value: boolean):
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({ type: 'SET_SHOW_ALL_CARDS', value });
        },
    setTabIndex: (value: number):
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({ type: 'SET_TAB_INDEX', value });
        },
    createFakeCustomers: ():
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            const db = new DataBuilder();
            CardManager.postCommits(db.getFakeCustomerCommits());
        },
    createFakeProducts: ():
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            const db = new DataBuilder();
            CardManager.postCommits(db.getFakeProductCommits());
        }
};