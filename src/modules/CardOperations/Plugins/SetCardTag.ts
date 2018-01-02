import CardOperation from '../CardOperation';
import { CardRecord } from '../../../models/Card';

export default class SetCardTag extends CardOperation {
    constructor() {
        super('SET_CARD_TAG');
    }
    apply(card: CardRecord, data: any): CardRecord {
        return card.setIn(['tags', data.tagName], data.tagValue);
    }
}