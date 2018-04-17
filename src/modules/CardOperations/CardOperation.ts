import { ActionRecord, CardRecord } from 'pmpos-models';

export default abstract class CardOperation {
    type: string;
    description: string | undefined;
    canReduce: (card: CardRecord, action: ActionRecord) => boolean;
    constructor(opType: string, description?: string) {
        this.type = opType;
        this.description = description;
    }
    abstract reduce(card: CardRecord, data: any): CardRecord;
    abstract canApply(card: CardRecord, data: any): boolean;
    abstract readConcurrencyData(card: CardRecord, actionData: any): any;
    abstract fixData(data: any): any;
    abstract canEdit(action: ActionRecord): boolean;
    abstract processPendingAction(action: ActionRecord): ActionRecord;
}