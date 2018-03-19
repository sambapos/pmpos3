import { CardRecord } from '../../models/Card';
import { ActionRecord } from '../../models/Action';

export default abstract class CardOperation {
    type: string;
    description: string | undefined;
    canReduce: (card: CardRecord, action: ActionRecord) => boolean;
    getEditor: (handler: (actionType: string, data: any) => void, cancel: () => void, current?: any) => JSX.Element;
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