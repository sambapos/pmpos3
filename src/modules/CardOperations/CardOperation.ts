import { CardRecord } from '../../models/Card';
import { ActionRecord } from '../../models/Action';

export default abstract class CardOperation {
    type: string;
    canApply: (card: CardRecord, action: ActionRecord) => boolean;
    constructor(opType: string) {
        this.type = opType;
    }
    abstract apply(card: CardRecord, data: any): CardRecord;
    abstract readConcurrencyData(card: CardRecord, actionData: any): any;
}