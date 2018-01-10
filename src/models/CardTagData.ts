import { CardTagRecord } from './CardTag';
import { CardRecord } from './Card';

export default class {

    tag: CardTagRecord;
    card: CardRecord;

    constructor(tag: CardTagRecord, card: CardRecord) {
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

    isInventory(filter: string): boolean {
        return this.tag.quantity > 0 && this.tag.value.toLowerCase().includes(filter.toLowerCase());
    }

    isSourceLocation(filter: string): boolean {
        return this.tag.source.toLowerCase().includes(filter.toLowerCase());
    }

    isTargetLocation(filter: string): boolean {
        return this.tag.target.toLowerCase().includes(filter.toLowerCase());
    }

    isLocation(filter: string): boolean {
        return this.isSourceLocation(filter) || this.isTargetLocation(filter);
    }

    private getDebitFor(filter: string): number {
        if (this.isInventory(filter)) {
            return this.card.debit;
        }
        return this.getTagDebit(this.tag, filter);
    }

    private getCreditFor(filter: string): number {
        if (this.isInventory(filter)) {
            return this.card.credit;
        }
        return this.getTagCredit(this.tag, filter);
    }

    private getTagDebit(tag: CardTagRecord, filter?: string): number {
        return tag.target &&
            (!filter || this.isTargetLocation(filter))
            ? tag.debitValue : 0;
    }

    private getTagCredit(tag: CardTagRecord, filter?: string): number {
        return tag.source &&
            (!filter || this.isSourceLocation(filter))
            ? tag.creditValue : 0;
    }
}