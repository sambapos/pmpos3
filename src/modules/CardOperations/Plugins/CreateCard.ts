import CardOperation from '../CardOperation';
import { CardRecord } from '../../../models/Card';
import * as shortid from 'shortid';

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
            typeId: data.typeId,
            type: data.type,
            time: data.time
        });
        if (card.id) {
            result = card.update('cards', map => map.set(result.id, result));
        }
        return result;
    }
    fixData(data: any) {
        if (!data.id) {
            data.id = shortid.generate();
        }
        return data;
    }
}