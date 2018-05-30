import { IValueSelection } from "./IValueSelection";

export class ValueSelection implements IValueSelection {
    public value: string;
    public caption: string;
    public amount: number;
    public max: number;
    public quantity: number;
    constructor(value: any) {
        if (value.value) {
            this.value = value.value;
            this.caption = value.caption;
            this.amount = value.amount || 0;
            this.max = value.max || 0;
            this.quantity = Math.max(value.quantity || 1, 1);
        } else {
            this.value = value;
            this.caption = value;
            this.amount = 0;
            this.max = 0;
            this.quantity = 1;
            if (value.includes('=')) {
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