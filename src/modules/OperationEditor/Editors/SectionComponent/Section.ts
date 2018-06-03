import { ValueSelection } from "./ValueSelection";
import { SelectedValue } from "./SelectedValue";
import { CardTagRecord } from "pmpos-core";

export class Section {
    public key: string;
    public max: number;
    public min: number;

    public selected: SelectedValue[];
    public values: ValueSelection[];

    constructor(key: string, selected: SelectedValue[], values: ValueSelection[], max: number, min: number) {
        this.key = key;
        this.selected = selected || [];
        this.values = values;
        this.max = max;
        this.min = min;
    }

    public getSelectedValues(): ValueSelection[] {
        return this.values.filter(value => this.selected.some(selected => value.ref === selected.ref));
    }

    public addSelectedTag(tag: CardTagRecord) {
        this.selected.push(new SelectedValue(tag.value, tag.name, tag.ref));
        const val = this.values.find(x => x.ref === tag.ref);
        if (val) {
            val.tagName = tag.name;
        }
    }
}