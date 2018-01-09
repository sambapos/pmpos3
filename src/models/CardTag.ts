import { Record } from 'immutable';

export interface CardTag {
    id: string;
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
    id: '',
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

        // let b = this.balance !== 0 ? this.balance : '';
        let u = this.unit ? this.unit : '';
        let q = this.quantity > 0 ? this.quantity + u + ' ' : '';
        let vl = this.value ? q + this.value : '';
        let key = !this.name || this.name[0] === '_' ? '' : this.name + ': ';
        // let st = this.source || this.target ? `${this.source} > ${this.target}` : '';
        return `${key}${vl}`;
    }
    get locationDisplay(): string {
        return this.source || this.target ? `${this.source} > ${this.target}` : '';
    }

    get balanceDisplay(): string {
        return this.balance !== 0 ? this.balance.toFixed(2) : '';
    }

    get debitDisplay(): string {
        return this.debit !== 0 ? this.debit.toFixed(2) : '';
    }

    get creditDisplay(): string {
        return this.credit !== 0 ? this.credit.toFixed(2) : '';
    }
}
