import { IExpiringItem } from "./IExpiringItem";

import { List as IList, Map as IMap } from 'immutable';
import { CardTagData } from 'pmpos-core';
import { ReportLine } from './ReportLine';
import { IBalance } from "./IBalance";

export class ReportView {
    public lines: IMap<string, ReportLine[]>;

    constructor(tags: IList<CardTagData>, searchValue: string) {
        this.lines = IMap<string, ReportLine[]>();
        for (const tag of tags.sort((a, b) => a.time - b.time).valueSeq().toArray()) {
            console.log('add tag', tag);
            this.addTag(tag, searchValue || tag.key);
        }
    }

    public get keys() {
        return this.lines.keySeq().toArray();
    }
    public summarize(key: string): ReportLine {
        const lines = this.processsExpiredItems(key, this.lines.get(key));
        return ReportLine.summarizeLines(key, lines);
    }

    public getLines() {
        if (this.keys.length > 1) {
            return this.keys.map(k => this.summarize(k))
        }
        if (this.keys.length === 1) {
            const key = this.keys[0];
            return this.processsExpiredItems(key, this.lines.get(key));
        }
        return [];
    }

    private addTag(tag: CardTagData, searchValue: string): void {
        const line = ReportLine.createFromTag(tag, searchValue);
        this.lines = this.lines.update(tag.getDisplayFor(searchValue) || '', items => {
            if (!items) { items = new Array<ReportLine>() }
            items.push(line);
            return items;
        })
    }

    private addItemTo(item: ReportLine, items: ReportLine[], balance: IBalance): IBalance {
        balance.balance = balance.balance + item.debit - item.credit;
        balance.quantity = balance.quantity + item.in - item.out;
        item.balance = balance.balance;
        item.remaining = balance.quantity;
        items.push(item);
        return balance;
    }

    private processsExpiredItems(key: string, items: ReportLine[] | undefined): ReportLine[] {
        let expiringItems = IMap<number, IExpiringItem>();
        const result = new Array<ReportLine>();
        let currentBalance: IBalance = { quantity: 0, balance: 0 };
        if (!items) {
            return result;
        }
        for (const item of items) {
            for (const expired of expiringItems.filter((v, k) => k < item.time).entrySeq().toArray()) {
                expiringItems = expiringItems.delete(expired[0]);
                const expiredItem = ReportLine.createExpired(key, expired[0], expired[1]);
                currentBalance = this.addItemTo(expiredItem, result, currentBalance);
            }
            if (item.expires) {
                const expiringItem = expiringItems.get(item.expiration);
                const remaining = expiringItem ? expiringItem.quantity : 0;
                expiringItems = expiringItems.set(item.expiration, { quantity: remaining + item.in, amount: item.debit / item.in });
            } else if (item.out > 0) {
                const date = expiringItems.keySeq().filter(x => x > item.time).min() || 0;
                if (date > 0) {
                    const expiringItem = expiringItems.get(date);
                    const remaining = expiringItem ? expiringItem.quantity : 0;
                    const amount = expiringItem ? expiringItem.amount : 0;
                    expiringItems = expiringItems.set(date, { quantity: remaining - item.out, amount });
                }
            }
            currentBalance = this.addItemTo(item, result, currentBalance);
        }
        for (const expired of expiringItems.filter((v, k) => k < new Date().getTime()).entrySeq().toArray()) {
            expiringItems = expiringItems.delete(expired[0]);
            result.push(ReportLine.createExpired(key, expired[0], expired[1]))
        }

        return result;
    }
}