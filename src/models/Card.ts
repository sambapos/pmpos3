import { Record, Map as IMap, List } from 'immutable';

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
    get display(): string {

        let q = this.quantity > 0 ? this.quantity + ' ' : '';
        // let b = this.balance !== 0 ? this.balance : '';
        let u = this.unit ? '.' + this.unit : '';
        let vl = this.value ? q + this.value : '';
        let key = !this.name || this.name[0] === '_' ? '' : this.name + ': ';
        // let st = this.source || this.target ? `${this.source} > ${this.target}` : '';
        return `${key}${vl}${u}`;
    }
}

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
    get balance(): number {
        let tagBalance = this.tags.reduce((x, y) => x + y.balance, 0);
        return tagBalance + this.subCardBalance;
    }

    get balanceDisplay(): string {
        if (this.balance !== 0) { return this.balance.toFixed(2); }
        return '';
    }

    get subCardBalance(): number {
        return this.cards.reduce((x, y) => x + y.balance, 0);
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
}
