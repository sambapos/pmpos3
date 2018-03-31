import { Reducer } from 'redux';
import * as shortid from 'shortid';
import { Record, Map as IMap } from 'immutable';
import { AppThunkAction } from './appThunkAction';
import { CardTypeRecord } from '../models/CardType';
import CardList from '../modules/CardList';
import RuleManager from '../modules/RuleManager';
import { RuleRecord } from '../models/Rule';
import { TagTypeRecord } from '../models/TagType';

interface ConfigState {
    protocol: any;
    currentCardType: CardTypeRecord;
    currentTagType: TagTypeRecord;
    currentRule: RuleRecord;
    isLoading: boolean;
    cardTypes: IMap<string, CardTypeRecord>;
    tagTypes: IMap<string, TagTypeRecord>;
    rules: IMap<string, RuleRecord>;
}

export class ConfigStateRecord extends Record<ConfigState>({
    protocol: undefined,
    isLoading: false,
    currentCardType: new CardTypeRecord(),
    currentRule: new RuleRecord(),
    currentTagType: new TagTypeRecord(),
    cardTypes: IMap<string, CardTypeRecord>(),
    tagTypes: IMap<string, TagTypeRecord>(),
    rules: IMap<string, RuleRecord>()
}) { }

type SetConfigProtocolAction = {
    type: 'SET_CONFIG_PROTOCOL',
    protocol: any
};

type ConfigReceivedAction = {
    type: 'CONFIG_RECEIVED',
    payload: Map<string, any>;
};

type AddRuleAction = {
    type: 'ADD_RULE'
};

type ResetRuleAction = {
    type: 'RESET_RULE'
};

type LoadRuleAction = {
    type: 'LOAD_RULE'
    id: String
    payload: Promise<RuleRecord>
};

type LoadRuleRequestAction = {
    type: 'LOAD_RULE_REQUEST'
};

type LoadRuleSuccessAction = {
    type: 'LOAD_RULE_SUCCESS'
    payload: RuleRecord
};

type LoadRuleFailAction = {
    type: 'LOAD_RULE_FAIL'
};

type AddCardTypeAction = {
    type: 'ADD_CARD_TYPE'
};

type ResetCardTypeAction = {
    type: 'RESET_CARD_TYPE'
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

/// ---
type AddTagTypeAction = {
    type: 'ADD_TAG_TYPE'
};

type ResetTagTypeAction = {
    type: 'RESET_TAG_TYPE'
};

type LoadTagTypeAction = {
    type: 'LOAD_TAG_TYPE'
    id: String
    payload: Promise<TagTypeRecord>
};

type LoadTagTypeRequestAction = {
    type: 'LOAD_TAG_TYPE_REQUEST'
};

type LoadTagTypeSuccessAction = {
    type: 'LOAD_TAG_TYPE_SUCCESS'
    payload: TagTypeRecord
};

type LoadTagTypeFailAction = {
    type: 'LOAD_TAG_TYPE_FAIL'
};

type KnownActions = SetConfigProtocolAction | ConfigReceivedAction | ResetCardTypeAction
    | LoadCardTypeAction | LoadCardTypeFailAction | LoadCardTypeRequestAction
    | LoadCardTypeSuccessAction | AddCardTypeAction

    | ResetRuleAction | LoadRuleAction | LoadRuleFailAction | LoadRuleRequestAction
    | LoadRuleSuccessAction | AddRuleAction

    | ResetTagTypeAction | LoadTagTypeAction | LoadTagTypeFailAction | LoadTagTypeRequestAction
    | LoadTagTypeSuccessAction | AddTagTypeAction;

export const reducer: Reducer<ConfigStateRecord> = (
    state: ConfigStateRecord = new ConfigStateRecord(),
    action: KnownActions
): ConfigStateRecord => {
    switch (action.type) {
        case 'SET_CONFIG_PROTOCOL': {
            return state.set('protocol', action.protocol);
        }
        case 'CONFIG_RECEIVED': {
            let cardTypeMap = IMap<string, CardTypeRecord>();
            let ruleMap = IMap<string, RuleRecord>();
            let tagTypeMap = IMap<string, TagTypeRecord>();

            if (action.payload.has('cardTypes')) {
                let cardTypes = action.payload.get('cardTypes');
                cardTypeMap = Object.keys(cardTypes)
                    .reduce((x, y) => x.set(y, new CardTypeRecord(cardTypes[y])), IMap<string, CardTypeRecord>());
                CardList.setCardTypes(cardTypeMap);
            }
            if (action.payload.has('tagTypes')) {
                let tagTypes = action.payload.get('tagTypes');
                tagTypeMap = Object.keys(tagTypes).
                    reduce((x, y) => x.set(y, new TagTypeRecord(tagTypes[y])), IMap<string, TagTypeRecord>());
                CardList.setTagTypes(tagTypeMap);
            }
            if (action.payload.has('rules')) {
                let rules = action.payload.get('rules');
                ruleMap = Object.keys(rules)
                    .reduce((x, y) => x.set(y, new RuleRecord(rules[y])), IMap<string, RuleRecord>());
                RuleManager.setRules(ruleMap);
            }
            return state
                .set('cardTypes', cardTypeMap)
                .set('tagTypes', tagTypeMap)
                .set('rules', ruleMap);
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
        // --
        case 'LOAD_TAG_TYPE_REQUEST': {
            return state
                .set('isLoading', true)
                .set('currentTagType', new TagTypeRecord());
        }
        case 'LOAD_TAG_TYPE_FAIL': {
            return state
                .set('isLoading', false)
                .set('currentTagType', new TagTypeRecord());
        }
        case 'LOAD_TAG_TYPE_SUCCESS': {
            return state
                .set('isLoading', false)
                .set('currentTagType', action.payload);
        }
        case 'RESET_TAG_TYPE': {
            return state
                .set('isLoading', false)
                .set('currentTagType', new TagTypeRecord());
        }
        case 'ADD_TAG_TYPE': {
            return state
                .set('isLoading', false)
                .set('currentTagType', new TagTypeRecord({
                    id: shortid.generate()
                }));
        }
        // --
        case 'LOAD_RULE_REQUEST': {
            return state
                .set('isLoading', true)
                .set('currentRule', new RuleRecord());
        }
        case 'LOAD_RULE_FAIL': {
            return state
                .set('isLoading', false)
                .set('currentRule', new RuleRecord());
        }
        case 'LOAD_RULE_SUCCESS': {
            return state
                .set('isLoading', false)
                .set('currentRule', action.payload);
        }
        case 'RESET_RULE': {
            return state
                .set('isLoading', false)
                .set('currentRule', new RuleRecord());
        }
        case 'ADD_RULE': {
            return state
                .set('isLoading', false)
                .set('currentRule', new RuleRecord({
                    id: shortid.generate()
                }));
        }
        default:
            return state;
    }
};

export const actionCreators = {
    deleteCardType: (id: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let result = getState().config.cardTypes.delete(id);
        getState().config.protocol.set('cardTypes', result.toJS());
        dispatch({
            type: 'RESET_CARD_TYPE'
        });
    },
    deleteRule: (id: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let result = getState().config.rules.delete(id);
        getState().config.protocol.set('rules', result.toJS());
        dispatch({
            type: 'RESET_RULE'
        });
    },
    deleteTagType: (id: string): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let result = getState().config.tagTypes.delete(id);
        getState().config.protocol.set('tagTypes', result.toJS());
        dispatch({
            type: 'RESET_TAG_TYPE'
        });
    },
    saveCardType: (cardType: CardTypeRecord): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let cardTypes = getState().config.cardTypes;
        let result = cardTypes.set(cardType.id, cardType);
        getState().config.protocol.set('cardTypes', result.toJS());
        dispatch({
            type: 'RESET_CARD_TYPE'
        });
    },
    saveRule: (rule: RuleRecord): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let rules = getState().config.rules;
        let result = rules.set(rule.id, rule);
        getState().config.protocol.set('rules', result.toJS());
        dispatch({
            type: 'RESET_RULE'
        });
    },
    saveTagType: (tagType: TagTypeRecord): AppThunkAction<KnownActions> => (dispatch, getState) => {
        let tagTypes = getState().config.tagTypes;
        let result = tagTypes.set(tagType.id, tagType);
        getState().config.protocol.set('tagTypes', result.toJS());
        dispatch({
            type: 'RESET_TAG_TYPE'
        });
    },
    addCardType: ():
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({
                type: 'ADD_CARD_TYPE'
            });
        },
    addRule: ():
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({
                type: 'ADD_RULE'
            });
        },
    addTagType: ():
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({
                type: 'ADD_TAG_TYPE'
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
        },
    loadRule: (id: string):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({
                type: 'LOAD_RULE',
                id,
                payload: new Promise<RuleRecord>((resolve, reject) => {
                    let rule = getState().config.rules.get(id);
                    if (!rule) {
                        reject(`${id} not found`);
                    } else {
                        resolve(rule);
                    }
                })
            });
        },
    loadTagType: (id: string):
        AppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({
                type: 'LOAD_TAG_TYPE',
                id,
                payload: new Promise<TagTypeRecord>((resolve, reject) => {
                    let tagType = getState().config.tagTypes.get(id);
                    if (!tagType) {
                        reject(`${id} not found`);
                    } else {
                        resolve(tagType);
                    }
                })
            });
        }
};