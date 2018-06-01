import { ValueSelection } from "./ValueSelection";

export interface ISection {
    selected: string | ValueSelection[];
    values: ValueSelection[];
    max: number;
    min: number;
}