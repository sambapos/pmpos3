import { CardTagRecord, CardRecord } from "pmpos-core";

export class ValueSelection {
    public value: string;
    public caption: string;
    public amount: number;
    public max: number;
    public quantity: number;
    public ref: string;
    public tagName: string;
    public unit: string | undefined;
    public typeId: string;
    public category: string | undefined;
    public source: string | undefined;
    public target: string | undefined;
    public func: string | undefined;
    constructor(value: any) {
        if (value instanceof CardTagRecord) {
            this.value = value.value;
            this.amount = value.amount;
            this.quantity = value.quantity;
            this.ref = value.ref || value.id;
            this.unit = value.unit ? value.unit : undefined;
            this.typeId = value.typeId;
            this.tagName = value.name;
            this.category = value.category ? value.category : undefined;
            this.source = value.source ? value.source : undefined;
            this.target = value.target ? value.target : undefined;
            this.func = value.func ? value.func : undefined;
            this.max = value.quantity > 1 ? value.quantity : 1;
        } else if (value instanceof CardRecord) {
            this.value = value.name;
            this.caption = String(value.getTagValue('Caption', ''));
            this.amount = Number(value.getTagValue('Amount', '') || value.getTagValue('Price', '')) || value.getTagAmount('Name') || 0;
            this.max = Number(value.getTagValue('Max', 0));
            this.quantity = Number(value.getTagValue('Quantity', 0));
            this.source = String(value.getTagValue('Source', '')) || value.getTagSource('Name');
            this.target = String(value.getTagValue('Target', '')) || value.getTagTarget('Name');
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

    public get isModifier(): boolean {
        return this.tagName.startsWith('_') && this.amount === 0;
    }

    private get valueDisplay(): string {
        return this.value + (this.amount !== 0 ? ` (${this.amount.toFixed(2)})` : '');
    }
}