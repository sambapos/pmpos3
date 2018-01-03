import Plugins from './Plugins';
import CardOperation from './CardOperation';
import { ActionRecord } from '../../models/Action';
import { CardRecord } from '../../models/Card';

class CardOperations {
    operations: Map<string, CardOperation>;
    constructor() {
        this.operations = new Map<string, CardOperation>();
    }
    register(op: CardOperation) {
        this.operations.set(op.type, op);
    }
    canHandle(action: ActionRecord) {
        return this.operations.has(action.actionType);
    }
    getConcurrencyData(actionType: string, card: CardRecord, actionData: any) {
        let operation = this.operations.get(actionType);
        return operation && operation.readConcurrencyData(card, actionData);
    }
    reduce(card: CardRecord, action: ActionRecord): CardRecord {
        let operation = this.operations.get(action.actionType);
        if (operation) { return operation.reduce(card, action.data); }
        return card;
    }
    canReduce(card: CardRecord, action: ActionRecord): boolean {
        let operation = this.operations.get(action.actionType);
        return operation !== undefined && operation.canReduce !== undefined && operation.canReduce(card, action);
    }
    canApplyAction(card: CardRecord, action: ActionRecord): boolean {
        let operation = this.operations.get(action.actionType);
        if (!operation) { return false; }
        return operation.canApply(card, action.data);
    }
    getOperations() {
        return Array.from(this.operations.values()).filter(x => x.description);
    }
}

export const cardOperations: CardOperations = new CardOperations();
Plugins.forEach(x => cardOperations.register(x));