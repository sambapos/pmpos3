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

    createEditor(success: (actionType: string, data: any) => void, cancel: () => void, current: any) {
        return React.createElement(TagEditor, {
            success, cancel, actionName: this.type,
            current: {
                tag: new CardTagRecord(current.tag),
                tagType: new TagTypeRecord(current.tagType)
            }
        });
    }

    readConcurrencyData(card: CardRecord, data: CardTagRecord) {
        return card.getIn(['tags', data.name]);
    }

    reduce(card: CardRecord, data: CardTagRecord): CardRecord {
        let r = new CardTagRecord(this.fixData(data));
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
        return data;
    }

    valueNeeded(data: any): boolean {
        return data.name.startsWith('_') || data.typeId;
    }

    canApply(card: CardRecord, data: any): boolean {
        if (!data.name || (this.valueNeeded(data) && !data.value)) { return false; }
        let currentValue = card.getIn(['tags', data.name]) as CardTagRecord;
        return !currentValue
            || currentValue.value !== data.value
            || currentValue.quantity !== data.quantity
            || currentValue.unit !== data.unit
            || currentValue.amount !== data.amount
            || currentValue.rate !== data.rate
            || currentValue.func !== data.func
            || currentValue.source !== data.source
            || currentValue.target !== data.target;
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