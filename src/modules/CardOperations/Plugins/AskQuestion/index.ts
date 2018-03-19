import * as React from 'react';
import CardOperation from '../../CardOperation';
import { CardRecord } from '../../../../models/Card';
import Editor from './component';
import { ActionRecord } from '../../../../models/Action';

export default class AskQuestion extends CardOperation {
    constructor() {
        super('ASK_QUESTION', 'Ask Question');
        this.getEditor = this.createEditor;
    }
    canEdit(action: ActionRecord): boolean {
        return true;
    }
    createEditor(success: (actionType: string, data: any) => void, cancel: () => void, current: any) {
        return React.createElement(Editor, { success, cancel, actionName: this.type, current });
    }
    canApply(card: CardRecord, data: any): boolean {
        return !card.isClosed;
    }
    readConcurrencyData(card: CardRecord, actionData: any) {
        return undefined;
    }
    reduce(card: CardRecord, data: any): CardRecord {
        return card;
    }
    fixData(data: any) {
        return data;
    }
    processPendingAction(action: ActionRecord): ActionRecord {
        return action;
    }
}