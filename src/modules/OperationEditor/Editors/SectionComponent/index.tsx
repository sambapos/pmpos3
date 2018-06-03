import * as React from "react";
import { Typography } from "@material-ui/core";
import decorate, { IStyle } from './style';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import StateButton from "./StateButton";
import { ValueSelection } from "./ValueSelection";
import { SelectedValue } from "./SelectedValue";

export interface ISectionComponentProps {
    name: string;
    values: any[];
    selected?: string | string[] | SelectedValue[],
    max?: number;
    min?: number;
    onChange: (name: string, values: ValueSelection[]) => void;
}

interface ISectionComponentState {
    values: ValueSelection[];
    selectedValues: ValueSelection[];
    helpText: string;
}

class SectionComponent extends React.Component<ISectionComponentProps & WithStyles<keyof IStyle>, ISectionComponentState>{

    constructor(props: ISectionComponentProps & WithStyles<keyof IStyle>) {
        super(props);
        const values = this.props.values.map(value => value instanceof ValueSelection ? value : new ValueSelection(value));
        const selectedValues = this.getSelectedValues(values, this.props.selected);
        this.state = { selectedValues, values, helpText: '' }
    }

    public render() {
        const max = this.props.max || 0;
        const min = this.props.min || 0;
        const total = this.state.selectedValues.reduce((r, v) => r += (v.quantity || 0), 0);

        return (
            <>
                <Typography style={{ margin: 4 }} variant="button">{this.props.name + (min - total > 0 ? ` (${min - total})` : '')}</Typography>
                <div className={this.props.classes.buttonContainer}>
                    {this.state.values.map(stateValue => (
                        <StateButton
                            key={this.props.name + '_' + stateValue.value}
                            value={stateValue}
                            isSelected={(value: ValueSelection) => this.isSelected(value)}
                            onClick={
                                (value: ValueSelection) => {
                                    let values = this.state.selectedValues;
                                    let helpText = '';
                                    if (this.isSelected(value)) {
                                        if (value.max && value.max > 1) {
                                            if ((max === 0 && value.max > value.quantity) || total < max) {
                                                value.quantity++;
                                            } else if (total === max || (max === 0 && value.max === value.quantity)) {
                                                value.quantity = 1;
                                            }
                                        }
                                        if (value.quantity < 2) { values = values.filter(x => x.value !== value.value); }
                                    } else if (max === 1) {
                                        values = [value]
                                    } else if (max === 0 || total < max) {
                                        values.push(value);
                                    } else if (max > 0 && total === max) {
                                        helpText = `You can select max ${max} values.`;
                                    }
                                    this.setState({ selectedValues: values, helpText });
                                    this.props.onChange(this.props.name, values);
                                }

                            }
                        />
                    ))}
                </div>
                <Typography style={{ margin: 4 }} variant="caption">{this.state.helpText}</Typography>
            </ >
        );
    }

    private isSelected(value: ValueSelection) {
        return this.state.selectedValues.some(s => s.value === value.value);
    }

    private getSelectionArray(values: ValueSelection[], selectedValues): ValueSelection[] {
        return values.filter(value => selectedValues.some((sv: any) => this.isSelectedItem(value, sv)));
    }

    private isSelectedItem(value: ValueSelection, item: string | SelectedValue) {
        if (item instanceof SelectedValue) {
            return item.ref === value.ref;
        }
        return value.value === item;
    }

    private getSelectedValues(values: ValueSelection[], selection: string | string[] | SelectedValue[] | undefined): ValueSelection[] {
        if (selection) {
            if (Array.isArray(selection)) {
                return this.getSelectionArray(values, selection);
            } else if (selection) {
                return this.getSelectionArray(values, [selection])
            }
        }
        return [];
    }
}

export default decorate(SectionComponent);