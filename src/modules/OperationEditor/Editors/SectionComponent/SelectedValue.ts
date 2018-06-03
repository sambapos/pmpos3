export class SelectedValue {
    public value: string;
    public ref?: string;
    public name?: string;

    constructor(value: string, name?: string, ref?: string) {
        this.value = value;
        this.name = name;
        this.ref = ref;
    }
}