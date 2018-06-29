import { ValueSelection } from "./ValueSelection";
import { CardTagRecord, TagTypeRecord } from "pmpos-core";

export class Section {
    public key: string;
    public max: number;
    public min: number;

    public selected: string[];
    public values: ValueSelection[];
    private originalSelection: ValueSelection[];
    private tagType: TagTypeRecord | undefined;

    constructor(key: string, selected: string[], values: ValueSelection[], max: number, min: number, tagType: TagTypeRecord | undefined) {
        this.key = key;
        this.selected = selected || [];
        this.values = values;
        this.max = max;
        this.min = min;
        this.originalSelection = values.length === 1 ? [new ValueSelection(values[0])] : [];
        this.tagType = tagType;
    }

    public get mask() {
        return this.tagType && this.tagType.realMask;
    }

    public getSelectedValues(): ValueSelection[] {
        return this.originalSelection;
    }

    public addSelectedTag(tag: CardTagRecord) {
        const ref = tag.ref || tag.id;
        this.selected.push(ref);
        if (this.values.length > 1) {
            const val = this.values.find(x => x.ref === ref);
            if (val) {
                val.tagName = tag.name;
                val.quantity = tag.quantity ? tag.quantity : 1;
                val.amount = tag.amount;
                this.originalSelection.push(new ValueSelection(val));
            }
        }
    }
}