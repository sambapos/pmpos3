import * as React from 'react';
import CardOperation from '../../CardOperation';
import { CardRecord } from '../../../../models/Card';
import Editor from './component';

export default class ExecuteCommand extends CardOperation {
    constructor() {
        super('EXECUTE_COMMAND', 'Execute Command');
        this.getEditor = this.createEditor;
    }
    createEditor(handler: (actionType: string, data: any) => void, current: any) {
        return React.createElement(Editor, { handler, actionName: this.type, current });
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
}