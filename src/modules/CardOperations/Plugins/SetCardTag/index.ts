import * as React from 'react';
import * as shortid from 'shortid';
import CardOperation from '../../CardOperation';
import { CardRecord } from '../../../../models/Card';
import { ActionRecord } from '../../../../models/Action';
import { CardTagRecord } from '../../../../models/CardTag';
import TagEditor from './component';
import CardList from '../../../CardList';
import { TagTypeRecord } from '../../../../models/TagType';

export default class SetCardTag extends CardOperation {

    constructor() {
        super('SET_CARD_TAG', 'Set Card Tag');
        this.canReduce = this.canReduceCard;
        this.getEditor = this.createEditor;
    }

    canEdit(action: ActionRecord): boolean {
        return !action.data.value;
    }

    createEditor(card: CardRecord, success: (actionType: string, data: any) => void, cancel: () => void, current: any) {
        let currentData = current || {};
        return React.createElement(TagEditor, {
            card, success, cancel, actionName: this.type,
            current: {
                tag: new CardTagRecord(currentData.tag),
                tagType: new TagTypeRecord(currentData.tagType)
            }
        });
    }

    readConcurrencyData(card: CardRecord, data: CardTagRecord) {
        return card.getIn(['tags', data.name]);
    }

    private tagValueRemoved(card: CardRecord, data: CardTagRecord) {
        return card.tags.has(data.name)
            && card.getTag(data.name, undefined)
            && !data.value;
    }

    private tagAmountRemoved(card: CardRecord, data: CardTagRecord) {
        return card.tags.has(data.name) && data.func && data.amount === 0;
    }

    reduce(card: CardRecord, data: CardTagRecord): CardRecord {
        let fixedData = this.fixData(data);
        // fixedData = this.fixType(card, fixedData);
        let r = new CardTagRecord(fixedData);
        if (this.tagValueRemoved(card, data)) {
            return card.deleteIn(['tags', data.name]);
        }
        if (this.tagAmountRemoved(card, data)) {
            return card.deleteIn(['tags', data.name]);
        }
        return card.setIn(['tags', data.name], r);
    }

    canReduceCard(card: CardRecord, action: ActionRecord): boolean {
        let current = this.readConcurrencyData(card, action.data) as CardTagRecord;
        return !current || current.value === action.concurrencyData.value;
    }

    fixData(data: any) {
        if (!data.name && data.value) {
            data.name = '_' + shortid.generate();
        }
        if (!Number.isNaN(Number(data.quantity))) { data.quantity = Number(data.quantity); }
        if (!Number.isNaN(Number(data.amount))) { data.amount = Number(data.amount); }
        if (!Number.isNaN(Number(data.rate))) { data.rate = Number(data.rate); }
        if (!data.typeId && data.typeName) { data.typeId = CardList.getTagTypeIdByName(data.typeName); }
        return data;
    }

    fixType(card: CardRecord, data: any) {
        if (!data.typeId && !data.typeName && card.typeId) {
            let ct = CardList.getCardType(card.typeId);
            if (ct) {
                let tt = ct.tagTypes.find(t => {
                    let ft = CardList.tagTypes.get(t);
                    if (ft && ft.tagName === data.name) {
                        return true;
                    }
                    return false;
                });
                if (tt) { data.typeId = tt; }
            }
        }
        return data;
    }

    valueNeeded(data: any, currentValue: CardTagRecord): boolean {
        return (!currentValue || !currentValue.value) && (data.name.startsWith('_') || data.typeId);
    }

    amountNeeded(data: any, currentValue: CardTagRecord): boolean {
        return (!currentValue || currentValue.amount === 0) && data.func;
    }

    valueChanged(currentValue: CardTagRecord, data: any) {
        if (!currentValue) { return true; }
        if (currentValue.value !== data.value) { return true; }
        if (currentValue.quantity !== data.quantity) { return true; }
        if (currentValue.unit !== data.unit) { return true; }
        if (currentValue.amount !== data.amount) { return true; }
        if (currentValue.func !== data.func) { return true; }
        if (currentValue.source !== data.source) { return true; }
        if (currentValue.target !== data.target) { return true; }
        return false;
    }

    canApply(card: CardRecord, data: any): boolean {
        let currentValue = card.getIn(['tags', data.name]) as CardTagRecord;
        if (!data.name || (this.valueNeeded(data, currentValue) && !data.value)) { return false; }
        if (this.amountNeeded(data, currentValue) && data.amount === 0) { return false; }
        return this.valueChanged(currentValue, data);
    }
    processPendingAction(action: ActionRecord): ActionRecord {
        let data = action.data;
        data.cardId = '';
        if (!action.data || !action.data.typeId || !action.data.name || !action.data.value) {
            return action.set('data', data);
        }
        let tagType = CardList.tagTypes.get(data.typeId);
        if (tagType) {
            let cardType = CardList.getCardTypeByRef(tagType.cardTypeReferenceName);
            if (cardType) {
                let card = CardList.getCardByName(cardType.name, action.data.value);
                data.cardId = card ? card.id : '';
            }

            if (data.source && tagType.sourceCardTypeReferenceName) {
                let sourceCardType = CardList.getCardTypeByRef(tagType.sourceCardTypeReferenceName);
                if (sourceCardType) {
                    let sourceCard = CardList.getCardByName(sourceCardType.name, data.source);
                    data.sourceCardId = sourceCard ? sourceCard.id : '';
                }
            }

            if (data.target && tagType.targetCardTypeReferenceName) {
                let targetCardType = CardList.getCardTypeByRef(tagType.targetCardTypeReferenceName);
                if (targetCardType) {
                    let targetCard = CardList.getCardByName(targetCardType.name, data.target);
                    data.targetCardId = targetCard ? targetCard.id : '';
                }
            }
        }
        return action.set('data', data);
    }
}