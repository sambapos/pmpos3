import CardOperation from '../CardOperation';
import { CardRecord } from '../../../models/Card';
import { ActionRecord } from '../../../models/Action';

export default class SetCardTag extends CardOperation {

    constructor() {
        super('SET_CARD_TAG');
        this.canApply = this.canApplyOperation;
    }

    readConcurrencyData(card: CardRecord, actionData: any) {
        return card.getIn(['tags', actionData.tagName]);
    }

    apply(card: CardRecord, data: any): CardRecord {
        return card.setIn(['tags', data.tagName], data.tagValue);
    }

    canApplyOperation(card: CardRecord, action: ActionRecord): boolean {
        let current = this.readConcurrencyData(card, action.data);
        return !current || current === action.concurrencyData;
    }
}