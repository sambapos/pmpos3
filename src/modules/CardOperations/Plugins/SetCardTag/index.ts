import * as React from 'react';
import CardOperation from '../../CardOperation';
import { CardRecord } from '../../../../models/Card';
import { ActionRecord } from '../../../../models/Action';
import TagEditor from './component';

export default class SetCardTag extends CardOperation {
    constructor() {
        super('SET_CARD_TAG', 'Set Card Tag');
        this.canReduce = this.canReduceCard;
        this.getEditor = this.createEditor;
    }

    createEditor(handler: (actionType: string, data: any) => void, current: any) {
        return React.createElement(TagEditor, { handler, actionName: this.type, current });
    }

    readConcurrencyData(card: CardRecord, actionData: any) {
        return card.getIn(['tags', actionData.tagName]);
    }

    reduce(card: CardRecord, data: any): CardRecord {
        return card.setIn(['tags', data.tagName], data.tagValue);
    }

    canReduceCard(card: CardRecord, action: ActionRecord): boolean {
        let current = this.readConcurrencyData(card, action.data);
        return !current || current === action.concurrencyData;
    }

    canApply(card: CardRecord, data: any): boolean {
        if (!data.tagName) { return false; }
        let currentValue = card.getIn(['tags', data.tagName]);
        return currentValue !== data.tagValue;
    }
}