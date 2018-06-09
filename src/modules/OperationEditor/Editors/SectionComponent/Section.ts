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
        this.originalSelection = values.length === 1 ? [new ValueSelection(values[0])] : [];
    }

    public getSelectedValues(): ValueSelection[] {
        return this.originalSelection;
    }

    public addSelectedTag(tag: CardTagRecord) {
        this.selected.push(tag.ref);
        const val = this.values.find(x => x.ref === tag.ref);
        if (val) {
            val.tagName = tag.name;
            val.quantity = Math.max(tag.quantity || 1, 1);
            val.amount = tag.amount;
        }
        this.originalSelection.push(new ValueSelection(val));
    }
}