import { Section } from "./Section";
import { CardTagRecord } from "pmpos-core";
import { SelectedValues } from "./SelectedValues";
import { ValueSelection } from "./ValueSelection";

export class Sections {
    public sections: Section[];

    constructor() {
        this.sections = [];
    }

    public get keys() {
        return this.sections.map(section => section.key);
    }

    public add(section: Section) {
        this.sections.push(section);
    }

    public addSelectedTag(tag: CardTagRecord) {
        const section = this.getSection(tag.category);
        if (section) {
            section.addSelectedTag(tag);
        }
    }

    public getSelectedValues() {
        let result = new Map<string, ValueSelection[]>();
        for (const section of this.sections) {
            const value = section.getSelectedValues();
            if (value) {
                result = result.set(section.key, value);
            }
        }
        return result;
    }
    public getNewValues(selectedValues: SelectedValues) {
        let resultMap = new Map<string, ValueSelection[]>();
        for (const [key, finalValues] of selectedValues.entries) {
            const result = new Array<ValueSelection>();
            const section = this.getSection(key);
            if (section) {
                const originalValues = section.getSelectedValues();
                for (const finalValue of finalValues) {
                    const ov = originalValues.find(o => o.ref === finalValue.ref);
                    if (!ov || ov.quantity !== finalValue.quantity) {
                        result.push(finalValue);
                    }
                }
            }
            if (result.length > 0) { resultMap = resultMap.set(key, result); }
        }
        console.log('new', resultMap);
        return resultMap;
    }

    public getDeletedValues(selectedValues: SelectedValues) {
        let resultMap = new Map<string, ValueSelection[]>();
        for (const section of this.sections) {
            const result = new Array<ValueSelection>();
            const finalValues = selectedValues.get(section.key);
            for (const originalValue of section.getSelectedValues()) {
                if (!finalValues || finalValues.every(fv => fv.ref !== originalValue.ref)) {
                    result.push(originalValue);
                }
            }
            if (result.length > 0) { resultMap = resultMap.set(section.key, result); }
        }

        // const originalSelection = this.getSelectedValues();
        // for (const [key, values] of Array.from(originalSelection.entries())) {
        //     const result = new Array<ValueSelection>();
        //     const selectedValues = selectedMap.get(key);
        //     if (selectedValues) {
        //         for (const value of values) {
        //             if (selectedValues.every(o => o.ref !== value.ref)) {
        //                 result.push(value);
        //             }
        //         }
        //     }
        //     if (result.length > 0) { resultMap = resultMap.set(key, result); }
        // }
        console.log('deleted', resultMap);
        return resultMap;
    }

    private getSection(key: string) {
        return this.sections.find(x => x.key === key);
    }
}