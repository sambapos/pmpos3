import { CardTagRecord, CardRecord } from "pmpos-core";

export class ValueSelection {
    public value: string;
    public caption: string;
    public amount: number;
    public max: number;
    public quantity: number;
    public ref: string;
    public tagName: string;
    public unit: string;
    public typeId: string;
    public category: string;
    public source: string;
    public target: string;
    public func: string;
    constructor(value: any) {
        if (value instanceof CardTagRecord) {
            this.value = value.value;
            this.amount = value.amount;
            this.quantity = value.quantity;
            this.ref = value.ref || value.id;
            this.unit = value.unit;
            this.typeId = value.typeId;
            this.tagName = value.name;
            this.category = value.category;
            this.source = value.source;
            this.target = value.target;
            this.func = value.func;
        } else if (value instanceof CardRecord) {
            this.value = value.name;
            this.caption = String(value.getTag('Caption', ''));
            this.amount = Number(value.getTag('Amount', '') || value.getTag('Price', '')) || 0;
            this.max = Number(value.getTag('Max', 0));
            this.quantity = Number(value.getTag('Quantity', 0));
            this.ref = value.id;
        } else if (value.value != null) {
            this.value = value.value;
            this.caption = value.caption;
            this.amount = value.amount || 0;
            this.max = value.max || 0;
            this.quantity = value.quantity || 0;
            this.ref = value.ref;
            this.tagName = value.tagName;
            this.unit = value.unit;
            this.typeId = value.typeId;
            this.category = value.category;
            this.source = value.source;
            this.target = value.target;
            this.func = value.func;
        } else if (typeof value === 'string') {
            this.value = value;
            this.caption = value;
            this.amount = 0;
            this.max = 0;
            this.quantity = 1;
            if (value && value.includes('=')) {
                const parts = value.split('=');
                this.value = parts[1];
                this.caption = parts[0];
            }
        }
    }

    public get display(): string {
        return this.caption ? this.caption : this.valueDisplay;
    }

    private get valueDisplay(): string {
        return this.value + (this.amount !== 0 ? ` (${this.amount.toFixed(2)})` : '');
    }
}