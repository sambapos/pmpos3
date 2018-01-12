import { CardTagRecord } from './CardTag';
import { CardRecord } from './Card';

export default class {
    key: string;
    tag: CardTagRecord;
    card: CardRecord;

    constructor(key: string, tag: CardTagRecord, card: CardRecord) {
        this.key = key;
        this.tag = tag;
        this.card = card;
    }

    get display(): string {
        return this.tag.display;
    }

    get id(): string {
        return this.tag.id;
    }

    get name(): string {
        return this.card.name;
    }

    get time(): number {
        return this.card.time;
    }

    getInDisplayFor(filter: string): string {
        let inValue = this.tag.getInQuantityFor(filter);
        return inValue !== 0 ? String(inValue) : '';
    }

    getOutDisplayFor(filter: string): string {
        let outValue = this.tag.getOutQuantityFor(filter);
        return outValue !== 0 ? String(outValue) : '';
    }

    getTotalFor(filter: string): number {
        return this.tag.getInQuantityFor(filter) - this.tag.getOutQuantityFor(filter);
    }

    getDebitDisplayFor(filter: string): string {
        let debit = this.getDebitFor(filter);
        return debit !== 0 ? debit.toFixed(2) : '';
    }

    getCreditDisplayFor(filter: string): string {
        let credit = this.getCreditFor(filter);
        return credit !== 0 ? credit.toFixed(2) : '';
    }

    getBalanceFor(filter: string): number {
        return this.getDebitFor(filter) - this.getCreditFor(filter);
    }

    isSourceAccount(filter: string): boolean {
        return this.tag.source.toLowerCase().includes(filter.toLowerCase());
    }

    isTargetAccount(filter: string): boolean {
        return this.tag.target.toLowerCase().includes(filter.toLowerCase());
    }

    isAccount(filter: string): boolean {
        return this.isSourceAccount(filter) || this.isTargetAccount(filter);
    }

    getDebitFor(filter: string): number {
        if (this.isAccount(filter)) {
            return this.isTargetAccount(filter) ? this.tag.amount : 0;
        }
        if (!this.tag.source && !this.tag.target) {
            return this.card.debit;
        }
        return this.tag.target ? Math.abs(this.card.balance) : 0;
    }

    getCreditFor(filter: string): number {
        if (this.isAccount(filter)) {
            return this.isSourceAccount(filter) ? this.tag.amount : 0;
        }
        if (!this.tag.source && !this.tag.target) {
            return this.card.credit;
        }
        return this.tag.source ? Math.abs(this.card.balance) : 0;
    }
}