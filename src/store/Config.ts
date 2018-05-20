import { Reducer } from 'redux';
import * as shortid from 'shortid';
import { Record, Map as IMap } from 'immutable';
import { IAppThunkAction } from './appThunkAction';
import { CardManager, ConfigManager, DataBuilder } from 'pmpos-modules';
import { CardTypeRecord, TagTypeRecord, RuleRecord } from 'pmpos-models';

interface IConfigState {
    currentCardType: CardTypeRecord;
    currentTagType: TagTypeRecord;
    currentRule: RuleRecord;
    isLoading: boolean;
    cardTypes: IMap<string, CardTypeRecord>;
    rootCardTypes: string[];
    tagTypes: IMap<string, TagTypeRecord>;
    rules: IMap<string, RuleRecord>;
}

export class ConfigStateRecord extends Record<IConfigState>({
    isLoading: false,
    currentCardType: new CardTypeRecord(),
    currentRule: new RuleRecord(),
    currentTagType: new TagTypeRecord(),
    cardTypes: IMap<string, CardTypeRecord>(),
    rootCardTypes: [],
    tagTypes: IMap<string, TagTypeRecord>(),
    rules: IMap<string, RuleRecord>()
}) { }

interface IConfigReceivedAction {
    type: 'CONFIG_RECEIVED',
    payload: Map<string, any>;
}

interface IAddRuleAction {
    type: 'ADD_RULE'
}

interface IResetRuleAction {
    type: 'RESET_RULE'
}

interface ILoadRuleAction {
    type: 'LOAD_RULE'
    id: string
    payload: Promise<RuleRecord>
}

interface ILoadRuleRequestAction {
    type: 'LOAD_RULE_REQUEST'
}

interface ILoadRuleSuccessAction {
    type: 'LOAD_RULE_SUCCESS'
    payload: RuleRecord
}

interface ILoadRuleFailAction {
    type: 'LOAD_RULE_FAIL'
}

interface IAddCardTypeAction {
    type: 'ADD_CARD_TYPE'
}

interface IResetCardTypeAction {
    type: 'RESET_CARD_TYPE'
}

interface ILoadCardTypeAction {
    type: 'LOAD_CARD_TYPE'
    id: string
    payload: Promise<CardTypeRecord>
}

interface ILoadCardTypeRequestAction {
    type: 'LOAD_CARD_TYPE_REQUEST'
}

interface ILoadCardTypeSuccessAction {
    type: 'LOAD_CARD_TYPE_SUCCESS'
    payload: CardTypeRecord
}

interface ILoadCardTypeFailAction {
    type: 'LOAD_CARD_TYPE_FAIL'
}

/// ---
interface IAddTagTypeAction {
    type: 'ADD_TAG_TYPE'
}

interface IResetTagTypeAction {
    type: 'RESET_TAG_TYPE'
}

interface ILoadTagTypeAction {
    type: 'LOAD_TAG_TYPE'
    id: string
    payload: Promise<TagTypeRecord>
}

interface ILoadTagTypeRequestAction {
    type: 'LOAD_TAG_TYPE_REQUEST'
}

interface ILoadTagTypeSuccessAction {
    type: 'LOAD_TAG_TYPE_SUCCESS'
    payload: TagTypeRecord
}

interface ILoadTagTypeFailAction {
    type: 'LOAD_TAG_TYPE_FAIL'
}

type KnownActions = IConfigReceivedAction | IResetCardTypeAction
    | ILoadCardTypeAction | ILoadCardTypeFailAction | ILoadCardTypeRequestAction
    | ILoadCardTypeSuccessAction | IAddCardTypeAction

    | IResetRuleAction | ILoadRuleAction | ILoadRuleFailAction | ILoadRuleRequestAction
    | ILoadRuleSuccessAction | IAddRuleAction

    | IResetTagTypeAction | ILoadTagTypeAction | ILoadTagTypeFailAction | ILoadTagTypeRequestAction
    | ILoadTagTypeSuccessAction | IAddTagTypeAction;

export const reducer: Reducer<ConfigStateRecord> = (
    state: ConfigStateRecord = new ConfigStateRecord(),
    action: KnownActions
): ConfigStateRecord => {
    switch (action.type) {
        case 'CONFIG_RECEIVED': {
            return state
                .set('cardTypes', ConfigManager.getCardTypes())
                .set('rootCardTypes', ConfigManager.getRootCardTypes())
                .set('tagTypes', ConfigManager.getTagTypes())
                .set('rules', ConfigManager.getRules());
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
                .set('currentCardType', new CardTypeRecord())
                .set('rootCardTypes', ConfigManager.getRootCardTypes());
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
    deleteCardType: (id: string): IAppThunkAction<KnownActions> => (dispatch, getState) => {
        const result = getState().config.cardTypes.delete(id);
        ConfigManager.saveCardTypes(result);
        dispatch({
            type: 'RESET_CARD_TYPE'
        });
    },
    deleteRule: (id: string): IAppThunkAction<KnownActions> => (dispatch, getState) => {
        const result = getState().config.rules.delete(id);
        ConfigManager.saveRules(result);
        dispatch({
            type: 'RESET_RULE'
        });
    },
    deleteTagType: (id: string): IAppThunkAction<KnownActions> => (dispatch, getState) => {
        const result = getState().config.tagTypes.delete(id);
        ConfigManager.saveTagTypes(result);
        dispatch({
            type: 'RESET_TAG_TYPE'
        });
    },
    saveCardType: (cardType: CardTypeRecord): IAppThunkAction<KnownActions> => (dispatch, getState) => {
        if (!cardType.name) { return; }
        const cardTypes = getState().config.cardTypes;
        const result = cardTypes.set(cardType.id, cardType);
        ConfigManager.saveCardTypes(result);
        dispatch({
            type: 'RESET_CARD_TYPE'
        });
    },
    saveRule: (rule: RuleRecord): IAppThunkAction<KnownActions> => (dispatch, getState) => {
        if (!rule.name) { return; }
        const rules = getState().config.rules;
        const result = rules.set(rule.id, rule);
        ConfigManager.saveRules(result);
        dispatch({
            type: 'RESET_RULE'
        });
    },
    saveTagType: (tagType: TagTypeRecord): IAppThunkAction<KnownActions> => (dispatch, getState) => {
        if (!tagType.name) { return; }
        const tagTypes = getState().config.tagTypes;
        const result = tagTypes.set(tagType.id, tagType);
        ConfigManager.saveTagTypes(result);
        dispatch({
            type: 'RESET_TAG_TYPE'
        });
    },
    addCardType: ():
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({
                type: 'ADD_CARD_TYPE'
            });
        },
    addRule: ():
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({
                type: 'ADD_RULE'
            });
        },
    addTagType: ():
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({
                type: 'ADD_TAG_TYPE'
            });
        },
    loadCardType: (id: string):
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({
                type: 'LOAD_CARD_TYPE',
                id,
                payload: new Promise<CardTypeRecord>((resolve, reject) => {
                    const cardType = getState().config.cardTypes.get(id);
                    if (!cardType) {
                        reject(`${id} not found`);
                    } else {
                        resolve(cardType);
                    }
                })
            });
        },
    loadRule: (id: string):
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({
                type: 'LOAD_RULE',
                id,
                payload: new Promise<RuleRecord>((resolve, reject) => {
                    const rule = getState().config.rules.get(id);
                    if (!rule) {
                        reject(`${id} not found`);
                    } else {
                        resolve(rule);
                    }
                })
            });
        },
    loadTagType: (id: string):
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            dispatch({
                type: 'LOAD_TAG_TYPE',
                id,
                payload: new Promise<TagTypeRecord>((resolve, reject) => {
                    const tagType = getState().config.tagTypes.get(id);
                    if (!tagType) {
                        reject(`${id} not found`);
                    } else {
                        resolve(tagType);
                    }
                })
            });
        },
    createDefaultConfig: ():
        IAppThunkAction<KnownActions> => (dispatch, getState) => {
            const db = new DataBuilder();
            const config = db.createConfig();
            ConfigManager.saveCardTypes(config.get('cardTypes') as IMap<string, any>);
            ConfigManager.saveTagTypes(config.get('tagTypes') as IMap<string, any>);
            ConfigManager.saveRules(config.get('rules') as IMap<string, any>);
            if (CardManager.getCards().count() === 0) {
                CardManager.postCommits(db.getDefaultCardCommits());
            }
        }
};