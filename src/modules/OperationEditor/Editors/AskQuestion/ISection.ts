import { IValueSelection } from "./IValueSelection";

export interface ISection {
    selected: string;
    values: IValueSelection[];
    max: number;
    min: number;
}