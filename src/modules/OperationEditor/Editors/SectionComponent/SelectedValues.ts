import { ValueSelection } from "./ValueSelection";
import { Sections } from "./Sections";

export class SelectedValues {
    public values: Map<string, ValueSelection[]>

    constructor(sections: Sections | Map<string, ValueSelection[]>) {
        this.values = sections instanceof Sections
            ? sections.getSelectedValues()
            : sections;
    }

    public get entries() {
        return Array.from(this.values.entries());
    }

    public get(key: string) {
        return this.values.get(key);
    }

    public set(key: string, value: ValueSelection[]): SelectedValues {
        return new SelectedValues(this.values.set(key, value));
    }
}