import * as React from 'react';
import CardOperation from '../../CardOperation';
import Editor from './component';
import { CardRecord, ActionRecord } from 'pmpos-models';

export default class ExecuteCommand extends CardOperation {
    constructor() {
        super('EXECUTE_COMMAND', 'Execute Command');
        this.getEditor = this.createEditor;
    }
    canEdit(action: ActionRecord): boolean {
        return !action.data.name;
    }
    createEditor(card: CardRecord, success: (actionType: string, data: any) => void, cancel: () => void, current: any) {
        return React.createElement(Editor, { card, success, cancel, actionName: this.type, current });
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