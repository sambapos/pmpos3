import { ValueSelection } from "./ValueSelection";
import { CardTagRecord } from "pmpos-core";

export class Section {
    public key: string;
    public max: number;
    public min: number;

    public selected: string[];
    public values: ValueSelection[];
    private originalSelection: ValueSelection[];

    constructor(key: string, selected: string[], values: ValueSelection[], max: number, min: number) {
        this.key = key;
        this.selected = selected || [];
        this.values = values;
        this.max = max;
        this.min = min;
        this.originalSelection = [];
    }

    public getSelectedValues(): ValueSelection[] {
        // return this.values.filter(value => this.selected.some(selected => value.ref === selected));
        return this.originalSelection;
    }

    public addSelectedTag(tag: CardTagRecord) {
        this.selected.push(tag.ref);
        const val = this.values.find(x => x.ref === tag.ref);
        if (val) {
            val.tagName = tag.name;
            val.quantity = tag.quantity;
            val.amount = tag.amount;
        }
        this.originalSelection.push(new ValueSelection(val));
    }
}