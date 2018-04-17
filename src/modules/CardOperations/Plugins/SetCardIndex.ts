import CardOperation from '../CardOperation';
import { CardRecord, ActionRecord } from 'pmpos-models';

export default class SetCardTag extends CardOperation {

    constructor() {
        super('SET_CARD_INDEX', 'Set Card Index');
    }
    canEdit(action: ActionRecord): boolean {
        return true;
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