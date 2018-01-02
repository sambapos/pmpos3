import CardOperation from '../CardOperation';
import { CardRecord } from '../../../models/Card';

export default class CreateCard extends CardOperation {
    constructor() {
        super('CREATE_CARD');
    }
    readConcurrencyData(card: CardRecord, actionData: any) {
        return undefined;
    }
    apply(card: CardRecord, data: any): CardRecord {
        return new CardRecord({
            id: data.id,
            time: data.time
        });
    }
}