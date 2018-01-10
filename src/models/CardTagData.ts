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

    private getDebitFor(filter: string): number {
        if (this.tag.value.toLowerCase().includes(filter.toLowerCase())) {
            return this.card.debit;
        }
        return this.getTagDebit(this.tag, filter);
    }

    private getCreditFor(filter: string): number {
        if (this.tag.value.toLowerCase().includes(filter.toLowerCase())) {
            return this.card.credit;
        }
        return this.getTagCredit(this.tag, filter);
    }

    private getTagDebit(tag: CardTagRecord, filter?: string): number {
        return tag.target &&
            (!filter || tag.target.toLowerCase().includes(filter.toLowerCase()))
            ? tag.debitValue : 0;
    }

    private getTagCredit(tag: CardTagRecord, filter?: string): number {
        return tag.source &&
            (!filter || tag.source.toLowerCase().includes(filter.toLowerCase()))
            ? tag.creditValue : 0;
    }
}