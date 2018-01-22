import * as React from 'react';
import * as shortid from 'shortid';
import CardOperation from '../../CardOperation';
import { CardRecord } from '../../../../models/Card';
import { ActionRecord } from '../../../../models/Action';
import { CardTagRecord } from '../../../../models/CardTag';
import TagEditor from './component';

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
            current: new CardTagRecord(current)
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
        if (!data.id) {
            data.id = shortid.generate();
        }
        if (!data.name && data.value) {
            data.name = '_' + shortid.generate();
        }
        if (!Number.isNaN(Number(data.quantity))) { data.quantity = Number(data.quantity); }
        if (!Number.isNaN(Number(data.amount))) { data.amount = Number(data.amount); }
        return data;
    }

    canApply(card: CardRecord, data: CardTagRecord): boolean {
        if (!data.name || (data.name.startsWith('_') && !data.value)) { return false; }
        let currentValue = card.getIn(['tags', data.name]) as CardTagRecord;
        return !currentValue
            || currentValue.value !== data.value
            || currentValue.quantity !== data.quantity
            || currentValue.unit !== data.unit
            || currentValue.amount !== data.amount
            || currentValue.source !== data.source
            || currentValue.target !== data.target;
    }
}