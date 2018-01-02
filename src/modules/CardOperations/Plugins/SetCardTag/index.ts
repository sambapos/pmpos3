import * as React from 'react';
import CardOperation from '../../CardOperation';
import { CardRecord } from '../../../../models/Card';
import { ActionRecord } from '../../../../models/Action';
import TagEditor from './component';

export default class SetCardTag extends CardOperation {

    constructor() {
        super('SET_CARD_TAG', 'Set Card Tag');
        this.canApply = this.canApplyOperation;
        this.getEditor = this.createEditor;
    }

    createEditor(handler: (actionType: string, data: any) => void) {
        return React.createElement(TagEditor, { handler, actionName: this.type });
    }

    readConcurrencyData(card: CardRecord, actionData: any) {
        return card.getIn(['tags', actionData.tagName]);
    }

    apply(card: CardRecord, data: any): CardRecord {
        return card.setIn(['tags', data.tagName], data.tagValue);
    }

    canApplyOperation(card: CardRecord, action: ActionRecord): boolean {
        let current = this.readConcurrencyData(card, action.data);
        return !current || current === action.concurrencyData;
    }
}