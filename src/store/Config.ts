import { Reducer } from 'redux';
import * as shortid from 'shortid';
import { Record, Map as IMap } from 'immutable';
import { AppThunkAction } from './appThunkAction';
import { CardTypeRecord } from '../models/CardTypes';

interface ConfigState {
    protocol: any;
    currentCardType: CardTypeRecord;
    isLoading: boolean;
    cardTypes: IMap<string, CardTypeRecord>;
}

export class ConfigStateRecord extends Record<ConfigState>({
    protocol: undefined,
    isLoading: false,
    currentCardType: new CardTypeRecord(),
    cardTypes: IMap<string, CardTypeRecord>()
}) { }

type AddCardTypeAction = {
    type: 'ADD_CARD_TYPE'
};

type ResetCardTypeAction = {
    type: 'RESET_CARD_TYPE'
};

type SetConfigProtocolAction = {
    type: 'SET_CONFIG_PROTOCOL',
    protocol: any
};

type ConfigReceivedAction = {
    type: 'CONFIG_RECEIVED',
    payload: Map<string, any>;
};

type LoadCardTypeAction = {
    type: 'LOAD_CARD_TYPE'
    id: String
    payload: Promise<CardTypeRecord>
};

type LoadCardTypeRequestAction = {
    type: 'LOAD_CARD_TYPE_REQUEST'
};

type LoadCardTypeSuccessAction = {
    type: 'LOAD_CARD_TYPE_SUCCESS'
    payload: CardTypeRecord
};

type LoadCardTypeFailAction = {
    type: 'LOAD_CARD_TYPE_FAIL'
};

type KnownActions = SetConfigProtocolAction | ConfigReceivedAction | ResetCardTypeAction
    | LoadCardTypeAction | LoadCardTypeFailAction | LoadCardTypeRequestAction
    | LoadCardTypeSuccessAction | AddCardTypeAction;

export const reducer: Reducer<ConfigStateRecord> = (
    state: ConfigStateRecord = new ConfigStateRecord(),
    action: KnownActions
): ConfigStateRecord => {
    switch (action.type) {
        case 'SET_CONFIG_PROTOCOL': {
            return state.set('protocol', action.protocol);
        }
        case 'LOAD_CARD_TYPE_REQUEST': {
            return state
                .set('isLoading', true)
                .set('currentCardType', new CardTypeRecord());
        }
        case 'LOAD_CARD_TYPE_FAIL': {
            return state
                .set('isLoading', false)
                .set('currentCardType', new CardTypeRecord());
        }
        case 'LOAD_CARD_TYPE_SUCCESS': {
            return state
                .set('isLoading', false)
                .set('currentCardType', action.payload);
        }
        case 'CONFIG_RECEIVED': {
            if (action.payload.has('cardTypes')) {
                let cardTypes = action.payload.get('cardTypes');
                let map = Object.keys(cardTypes)
                    .reduce((x, y) => x.set(y, new CardTypeRecord(cardTypes[y])), IMap<string, CardTypeRecord>());
                return state.set('cardTypes', map);
            }
            return state;
        }
        case 'RESET_CARD_TYPE': {
            return state
                .set('isLoading', false)
                .set('currentCardType', new CardTypeRecord());
        }
        case 'ADD_CARD_TYPE': {
            return state
                .set('isLoading', false)
                .set('currentCardType', new CardTypeRecord({
                    id: shortid.generate()
                }));
        }
        default:
            return state;
    }
};

export const actionCreators = {
    saveCardType: (cardType: CardTypeRecord): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let cardTypes = getState().config.cardTypes;
        let result = cardTypes.set(cardType.id, cardType);
        getState().config.protocol.set('cardTypes', result.toJS());
        dispatch({
            type: 'RESET_CARD_TYPE'
        });
    },
    addCardType: ():
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({
                type: 'ADD_CARD_TYPE'
            });
        },
    loadCardType: (id: string):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({
                type: 'LOAD_CARD_TYPE',
                id,
                payload: new Promise<CardTypeRecord>((resolve, reject) => {
                    let cardType = getState().config.cardTypes.get(id);
                    if (!cardType) {
                        reject(`${id} not found`);
                    } else {
                        resolve(cardType);
                    }
                })
            });
        }
};