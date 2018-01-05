import { Record, List, Map as IMap } from 'immutable';

export interface CardTag {
    name: string;
    value: string;
    quantity: number;
    unit: string;
    debit: number;
    credit: number;
    source: string;
    target: string;
}

export class CardTagRecord extends Record<CardTag>({
    name: '',
    value: '',
    quantity: 0,
    unit: '',
    debit: 0,
    credit: 0,
    source: '',
    target: ''
}) {
    get balance(): number { return (this.debit - this.credit) * Math.max(this.quantity, 1); }
}

export interface Card {
    id: string;
    time: number;
    tags: IMap<string, CardTagRecord>;
    cards: List<CardRecord>;
}

export class CardRecord extends Record<Card>({
    id: '',
    time: 0,
    tags: IMap<string, CardTagRecord>(),
    cards: List<CardRecord>()
}) {
    get balance(): number {
        let tagBalance = this.tags.reduce((x, y) => x + y.balance, 0);
        return tagBalance + this.subCardBalance;
    }

    get subCardBalance(): number {
        return this.cards.reduce((x, y) => x + y.balance, 0);
    }

    get display(): string {
        let nameTag = this.tags.get('Name');
        return nameTag && nameTag.value ? nameTag.value : this.id;
    }
}
