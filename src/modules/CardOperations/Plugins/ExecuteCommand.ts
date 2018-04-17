import CardOperation from '../CardOperation';
import { CardRecord, ActionRecord } from 'pmpos-models';

export default class ExecuteCommand extends CardOperation {
    constructor() {
        super('EXECUTE_COMMAND', 'Execute Command');
    }
    canEdit(action: ActionRecord): boolean {
        return !action.data.name;
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