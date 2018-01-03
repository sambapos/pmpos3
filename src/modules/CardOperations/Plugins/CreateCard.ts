import CardOperation from '../CardOperation';
import { CardRecord } from '../../../models/Card';

export default class CreateCard extends CardOperation {
    canApply(card: CardRecord, data: any): boolean {
        return data.id;
    }
    constructor() {
        super('CREATE_CARD');
    }
    readConcurrencyData(card: CardRecord, actionData: any) {
        return undefined;
    }
    reduce(card: CardRecord, data: any): CardRecord {
        return new CardRecord({
            id: data.id,
            time: data.time
        });
    }
}