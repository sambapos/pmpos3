import CardOperation from '../CardOperation';
import { CardRecord } from '../../../models/Card';

export default class ButtonClick extends CardOperation {

    canApply(card: CardRecord, data: any): boolean {
        return !card.isClosed;
    }
    constructor() {
        super('BUTTON_CLICK', 'Button Click');
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