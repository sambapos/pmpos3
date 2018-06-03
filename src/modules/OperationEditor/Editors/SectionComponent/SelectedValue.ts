export class SelectedValue {
    public value: string;
    public ref?: string;
    public name?: string;
    public quantity?: number;
    public amount?: number;

    constructor(value: string, name?: string, ref?: string, quantity?: number, amount?: number) {
        this.value = value;
        this.name = name;
        this.ref = ref;
        this.quantity = quantity;
        this.amount = amount;
    }
}