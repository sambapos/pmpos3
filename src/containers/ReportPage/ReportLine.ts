import { CardTagData } from "pmpos-core";
import * as moment from 'moment';
import * as shortid from 'shortid';
import { IExpiringItem } from "./IExpiringItem";

export class ReportLine {

    public static summarizeLines(key: string, lines: ReportLine[]): ReportLine {
        const result = new ReportLine();
        result.id = shortid.generate();
        result.name = lines[0].display.toLowerCase() === lines[0].key ? lines[0].display : key;
        result.display = lines[0].display.toLowerCase() === lines[0].key ? key : lines[0].display;
        result.time = new Date().getTime();
        result.in = 0;
        result.out = 0;
        result.debit = 0;
        result.credit = 0;
        result.remaining = 0;
        result.balance = 0;
        for (const line of lines) {
            result.in = result.in + line.in;
            result.out = result.out + line.out;
            result.remaining = result.remaining + line.in - line.out;
            result.debit = result.debit + line.debit;
            result.credit = result.credit + line.credit;
            result.balance = result.balance + line.debit - line.credit;
        }
        return result;
    }

    public static createFromTag(tag: CardTagData, filter: string): ReportLine {
        const result = new ReportLine();
        result.id = tag.id;
        result.name = tag.name || tag.tagValue;
        result.display = tag.getDisplayFor(filter);
        if (result.display.toLowerCase() === tag.key.toLowerCase()) {
            result.display = result.name;
            result.name = '';
        };
        result.time = tag.time;
        result.expiration = tag.expiration;
        result.in = tag.tag.getInQuantityFor(filter);
        result.out = tag.tag.getOutQuantityFor(filter);
        result.debit = tag.getDebitFor(filter);
        result.credit = tag.getCreditFor(filter);
        result.location = tag.isSourceAccount(filter) ? tag.tag.source : tag.isTargetAccount(filter) ? tag.tag.target : '';
        result.key = tag.key;
        return result;
    }

    public static createExpired(key: string, date: number, item: IExpiringItem): ReportLine {
        const result = new ReportLine();
        result.id = shortid.generate();
        result.name = '';
        result.display = `${item.quantity} ${key} Expired`;
        result.time = date;
        result.expiration = 0;
        result.in = 0;
        result.out = item.quantity;
        result.debit = 0;
        result.credit = item.amount * item.quantity;
        return result;
    }

    public id: string;
    public name: string;
    public display: string;
    public time: number;
    public expiration: number;
    public in: number;
    public out: number;
    public remaining: number;
    public debit: number;
    public credit: number;
    public balance: number;
    public location: string;
    public key: string;

    public get expires(): boolean {
        return this.expiration > 0;
    }

    public get transactionDate(): string {
        return moment(this.time).format();
    }

    public get expirationDate(): string {
        return moment(this.expiration).format();
    }

    public get InDisplay(): string {
        return this.in !== 0 ? String(this.in) : '';
    }

    public get OutDisplay(): string {
        return this.out !== 0 ? String(this.out) : '';
    }

    public get DebitDisplay(): string {
        return this.debit !== 0 ? this.debit.toFixed(2) : '';
    }

    public get CreditDisplay(): string {
        return this.credit !== 0 ? this.credit.toFixed(2) : '';
    }

    public get BalanceDisplay(): string {
        return this.balance !== 0 ? this.balance.toFixed(2) : '';
    }
    public get RemainingDisplay(): string {
        return this.remaining !== 0 ? String(this.remaining) : '';
    }
}