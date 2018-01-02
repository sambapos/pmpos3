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
    reduce(card: CardRecord, action: ActionRecord): CardRecord {
        let reducer = this.operations.get(action.actionType);
        if (reducer) { return reducer.apply(card, action.data); }
        return card;
    }
}

export const cardOperations: CardOperations = new CardOperations();
Plugins.forEach(x => cardOperations.register(x));