import CardOperation from '../CardOperation';
import { ActionRecord, CardRecord } from 'pmpos-models';

export default class AskQuestion extends CardOperation {
    constructor() {
        super('ASK_QUESTION', 'Ask Question');
    }
    canEdit(action: ActionRecord): boolean {
        return true;
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