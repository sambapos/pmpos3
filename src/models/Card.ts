import { Record, Map as IMap, List } from 'immutable';
import { CardTagRecord } from './CardTag';

export interface Card {
    id: string;
    time: number;
    typeId: string;
    isClosed: boolean;
    tags: IMap<string, CardTagRecord>;
    cards: IMap<string, CardRecord>;
    keys: List<string>;
}

export class CardRecord extends Record<Card>({
    id: '',
    time: 0,
    typeId: '',
    isClosed: false,
    tags: IMap<string, CardTagRecord>(),
    cards: IMap<string, CardRecord>(),
    keys: List<string>()
}) {
    get debit(): number {
        let tagDebit = this.tags.reduce((x, y) => x + y.debitValue, 0);
        return tagDebit + this.subCardDebit;
    }

    get credit(): number {
        let tagCredit = this.tags.reduce((x, y) => x + y.creditValue, 0);
        return tagCredit + this.subCardCredit;
    }

    get balance(): number {
        return this.debit - this.credit;
    }

    get debitDisplay(): string {
        let debit = this.debit;
        if (debit !== 0) { return debit.toFixed(2); }
        return '';
    }

    get creditDisplay(): string {
        let credit = this.credit;
        if (credit !== 0) { return credit.toFixed(2); }
        return '';
    }

    get balanceDisplay(): string {
        let balance = this.balance;
        if (balance !== 0) { return balance.toFixed(2); }
        return '';
    }

    get subCardDebit(): number {
        return this.cards.reduce((x, y) => x + y.debit, 0);
    }

    get subCardCredit(): number {
        return this.cards.reduce((x, y) => x + y.credit, 0);
    }

    get display(): string {
        return this.name || this.id;
    }

    get name(): string {
        return this.tags.getIn(['Name', 'value']) || '';
    }

    get isNew(): boolean {
        return this.tags.count() === 0 && this.cards.count() === 0;
    }

    getTags(filter?: (card: CardTagRecord) => boolean): List<CardTagRecord> {
        let tags = this.tags.valueSeq();
        if (filter) {
            tags = tags.filter(filter);
        }
        return List<CardTagRecord>(tags);
    }
}