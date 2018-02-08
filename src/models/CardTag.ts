import { Record } from 'immutable';
import * as tmpl from 'blueimp-tmpl';

export interface CardTag {
    id: string;
    name: string;
    value: string;
    quantity: number;
    unit: string;
    amount: number;
    rate: number;
    source: string;
    target: string;
}

export class CardTagRecord extends Record<CardTag>({
    id: '',
    name: '',
    value: '',
    quantity: 0,
    unit: '',
    amount: 0,
    rate: 0,
    source: '',
    target: ''
}) {

    get display(): string {
        // let b = this.balance !== 0 ? this.balance : '';
        let u = this.unit ? this.unit : '';
        let q = this.quantity !== 0 ? this.quantity + u + ' ' : '';
        let vl = this.value ? q + this.value : '';
        let key = !this.name || this.name[0] === '_' ? '' : this.name + ': ';
        // let st = this.source || this.target ? `${this.source} > ${this.target}` : '';
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
    getRealAmount(parentAmount: number): number {
        if (this.rate !== 0) {
            let amount = ((parentAmount * this.rate) / 100) + this.amount;
            let result = Math.round(amount * 100) / 100;
            console.log('calc', this.name, result);
            return result;
        }
        return this.amount;
    }
    getFormattedDisplay(displayFormat: string) {
        if (!displayFormat || !displayFormat.includes('{%')) { return this.display; }
        return tmpl(displayFormat, this);
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

    // getBalanceDisplay(parentAmount: number): string {
    //     let balance = this.getBalance(parentAmount);
    //     return balance !== 0 ? balance.toFixed(2) : '';
    // }
}
