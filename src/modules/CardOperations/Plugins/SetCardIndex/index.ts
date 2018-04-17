import * as React from 'react';
import CardOperation from '../../CardOperation';
import IndexEditor from './component';
import { CardRecord, ActionRecord } from 'pmpos-models';

export default class SetCardTag extends CardOperation {

    constructor() {
        super('SET_CARD_INDEX', 'Set Card Index');
        this.getEditor = this.createEditor;
    }
    canEdit(action: ActionRecord): boolean {
        return true;
    }
    createEditor(card: CardRecord, success: (actionType: string, data: any) => void, cancel: () => void, current: any) {
        return React.createElement(IndexEditor, {
            card, success, cancel, actionName: this.type, current
        });
    }
    readConcurrencyData(card: CardRecord, data: any) {
        return undefined;
    }
    reduce(card: CardRecord, data: any): CardRecord {
        return card.set('index', data.index);
    }
    fixData(data: any) {
        return data;
    }
    canApply(card: CardRecord, data: any): boolean {
        return card.index !== data.index;
    }
    processPendingAction(action: ActionRecord): ActionRecord {
        return action;
    }
}