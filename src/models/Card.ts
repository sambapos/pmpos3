import { Record, Map as IMap, List } from 'immutable';
import { CardTagRecord } from './CardTag';

export interface Card {
    id: string;
    time: number;
    typeId: string;
    type: string;
    isClosed: boolean;
    tags: IMap<string, CardTagRecord>;
    cards: IMap<string, CardRecord>;
}

export class CardRecord extends Record<Card>({
    id: '',
    time: 0,
    typeId: '',
    type: '',
    isClosed: false,
    tags: IMap<string, CardTagRecord>(),
    cards: IMap<string, CardRecord>()
}) {
    get debit(): number {
        let tagDebit = this.tags.reduce((x, y) => x + y.debit, 0);
        return tagDebit + this.subCardDebit;
    }

    get credit(): number {
        let tagCredit = this.tags.reduce((x, y) => x + y.credit, 0);
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

    getSubCard(id: string): CardRecord | undefined {
        return this.cards.find(x => x.getCard(id) !== undefined);
    }

    getCard(id: string): CardRecord | undefined {
        if (!id) { return undefined; }
        if (this.id === id) { return this; }
        return this.getSubCard(id);
    }

    acceptsFilter(tag: CardTagRecord, filter: string): boolean {
        let sv = filter.toLowerCase();
        return (tag.value.toLowerCase().includes(sv) && tag.name !== 'Name')
            || tag.source.toLowerCase().includes(sv)
            || tag.target.toLowerCase().includes(sv);
    }

    getTags(filters: string[]): { filter: string, result: List<CardTagRecord> } {
        let tags = this.tags.valueSeq();
        for (const filter of filters) {
            let filteredTags = tags.filter(t => this.acceptsFilter(t, filter));
            if (filteredTags.count() > 0) {
                return { filter, result: List<CardTagRecord>(filteredTags) };
            }
        }
        return { filter: '', result: List<CardTagRecord>() };
    }
}