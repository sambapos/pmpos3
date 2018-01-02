import { CardRecord } from '../../models/Card';

export default abstract class CardOperation {
    type: string;
    constructor(opType: string) {
        this.type = opType;
    }
    abstract apply(card: CardRecord, data: any): CardRecord;
}