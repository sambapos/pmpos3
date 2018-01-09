import CardOperation from '../CardOperation';
import { CardRecord } from '../../../models/Card';

export default class CreateCard extends CardOperation {
    canApply(card: CardRecord, data: any): boolean {
        return data.id;
    }
    constructor() {
        super('CREATE_CARD', 'Create Card');
    }
    readConcurrencyData(card: CardRecord, actionData: any) {
        return undefined;
    }
    reduce(card: CardRecord, data: any): CardRecord {
        let result = new CardRecord({
            id: data.id,
            type: data.type,
            time: data.time
        });
        if (card.id) {
            result = result.update('keys', list => card.keys.push(card.id));
            result = card.update('cards', map => map.set(result.id, result));
        }
        return result;
    }
}