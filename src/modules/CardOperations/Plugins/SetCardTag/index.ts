import * as React from 'react';
import CardOperation from '../../CardOperation';
import { CardRecord } from '../../../../models/Card';
import { ActionRecord } from '../../../../models/Action';
import TagEditor from './component';
import { CardTagRecord } from '../../../../models/CardTag';

export default class SetCardTag extends CardOperation {
    constructor() {
        super('SET_CARD_TAG', 'Set Card Tag');
        this.canReduce = this.canReduceCard;
        this.getEditor = this.createEditor;
    }

    createEditor(handler: (actionType: string, data: any) => void, current: any) {
        return React.createElement(TagEditor, { handler, actionName: this.type, current });
    }

    readConcurrencyData(card: CardRecord, data: CardTagRecord) {
        return card.getIn(['tags', data.name]);
    }

    reduce(card: CardRecord, data: CardTagRecord): CardRecord {
        return card.setIn(['tags', data.name], new CardTagRecord(data));
    }

    canReduceCard(card: CardRecord, action: ActionRecord): boolean {
        let current = this.readConcurrencyData(card, action.data) as CardTagRecord;
        return !current || current.value === action.concurrencyData.value;
    }

    canApply(card: CardRecord, data: CardTagRecord): boolean {
        console.log('DATA EVAL', data);
        if (!data.name) { return false; }
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