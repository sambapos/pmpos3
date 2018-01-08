import CardOperation from '../CardOperation';
import { CardRecord } from '../../../models/Card';

export default class CloseCard extends CardOperation {
    canApply(card: CardRecord, data: any): boolean {
        return data.id && !card.isClosed && card.balance === 0;
    }
    constructor() {
        super('CLOSE_CARD', 'Close Card');
    }
    readConcurrencyData(card: CardRecord, actionData: any) {
        return undefined;
    }
    reduce(card: CardRecord, data: any): CardRecord {
        return card.set('isClosed', true);
    }
}