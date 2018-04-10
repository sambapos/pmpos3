import CardOperation from '../CardOperation';
import { CardRecord } from '../../../models/Card';
import { ActionRecord } from '../../../models/Action';

export default class CloseCard extends CardOperation {
    constructor() {
        super('DISPLAY_CARD', 'Display Card');
    }
    canEdit(action: ActionRecord): boolean {
        return false;
    }
    canApply(card: CardRecord, data: any): boolean {
        return true;
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