import { Record } from 'immutable';
import { Parser } from 'expr-eval';

export interface CardTag {
    id: string;
    typeId: string;
    name: string;
    value: string;
    quantity: number;
    unit: string;
    amount: number;
    func: string;
    source: string;
    target: string;
    cardId: string;
    sourceCardId: string;
    targetCardId: string;
}

export class CardTagRecord extends Record<CardTag>({
    id: '',
    typeId: '',
    name: '',
    value: '',
    quantity: 0,
    unit: '',
    amount: 0,
    func: '',
    source: '',
    target: '',
    cardId: '',
    sourceCardId: '',
    targetCardId: ''
}) {

    get display(): string {
        let u = this.unit ? this.unit : '';
        let q = this.quantity !== 0 ? this.quantity + u + ' ' : '';
        let vl = this.value ? q + this.value : '';
        let key = !this.name || this.name[0] === '_' ? '' : this.name + ': ';
        return `${key}${vl}`;
    }
    get realQuantity(): number {
        return this.quantity !== 0 ? this.quantity : 1;
    }
    getDebit(parentAmount: number): number {
        return this.source ? this.realQuantity * this.getRealAmount(parentAmount) : 0;
    }
    getCredit(parentAmount: number): number {
        return this.target ? this.realQuantity * this.getRealAmount(parentAmount) : 0;
    }
    getBalance(parentAmount: number): number {
        return this.getDebit(parentAmount) - this.getCredit(parentAmount);
    }
    getRealAmount(parentAmount: number): number {
        // if (this.rate !== 0) {
        //     let amount = ((parentAmount * this.rate) / 100) + this.amount;
        //     let result = Math.round(amount * 100) / 100;
        //     return result;
        // }
        if (this.func) {
            return Parser.evaluate(this.func, { a: this.amount, p: parentAmount });
        }
        return this.amount;
    }
    getInQuantityFor(location?: string): number {
        location = location && location.toLowerCase();
        if (location && this.value.toLowerCase().includes(location)) {
            return this.target ? this.quantity : 0;
        }
        return this.target && (!location || this.target.toLowerCase().includes(location)) ? this.quantity : 0;
    }

    getOutQuantityFor(location?: string): number {
        location = location && location.toLowerCase();
        if (location && this.value.toLowerCase().includes(location)) {
            return this.target ? 0 : this.quantity;
        }
        return this.source && (!location || this.source.toLowerCase().includes(location)) ? this.quantity : 0;
    }

    getTotalQuantityFor(location: string): number {
        return this.getInQuantityFor(location) - this.getOutQuantityFor(location);
    }

    get locationDisplay(): string {
        return this.source || this.target ? `${this.source} > ${this.target}` : '';
    }

    acceptsFilter(filter: string): boolean {
        let sv = filter.toLowerCase();
        return (this.value.toLowerCase().includes(sv) && this.name !== 'Name')
            || this.source.toLowerCase().includes(sv)
            || this.target.toLowerCase().includes(sv);
    }
}
