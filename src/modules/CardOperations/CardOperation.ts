import { CardRecord } from '../../models/Card';
import { ActionRecord } from '../../models/Action';

export default abstract class CardOperation {
    type: string;
    description: string | undefined;
    canApply: (card: CardRecord, action: ActionRecord) => boolean;
    getEditor: (handler: (actionType: string, data: any) => void) => JSX.Element;
    constructor(opType: string, description?: string) {
        this.type = opType;
        this.description = description;
    }
    abstract apply(card: CardRecord, data: any): CardRecord;
    abstract readConcurrencyData(card: CardRecord, actionData: any): any;
}