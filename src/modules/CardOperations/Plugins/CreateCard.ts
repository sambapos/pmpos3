import CardOperation from '../CardOperation';
import { CardRecord } from '../../../models/Card';

export default class CreateCard extends CardOperation {
    canApply(card: CardRecord, data: any): boolean {
        return data.id;
    }
    constructor() {
        super('CREATE_CARD', 'Add new Card');
    }
    readConcurrencyData(card: CardRecord, actionData: any) {
        return undefined;
    }
    reduce(card: CardRecord, data: any): CardRecord {
        let result = new CardRecord({
            id: data.id,
            time: data.time
        });
        if (card.id) {
            result = card.update('cards', list => list.push(result));
        }
        return result;
    }
}