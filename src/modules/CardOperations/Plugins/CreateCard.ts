import CardOperation from '../CardOperation';
import { CardRecord } from '../../../models/Card';

export default class CreateCard extends CardOperation {
    constructor() {
        super('CREATE_CARD');
    }
    apply(card: CardRecord, data: any): CardRecord {
        return new CardRecord({
            id: data.id,
            time: data.time
        });
    }
}