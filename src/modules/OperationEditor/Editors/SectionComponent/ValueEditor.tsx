import * as React from "react";
import { ValueSelection } from "./ValueSelection";
import { Typography, TextField } from "@material-ui/core";
import MaskedTextInput from "../../../../components/MaskedTextInput";
import { ConfigManager, CardManager } from "sambadna-core";
import AutoSuggest from "../../../../components/AutoSuggest";
import decorate, { IStyle } from './style';
import { WithStyles } from '@material-ui/core/styles/withStyles';

interface IProps {
    name: string;
    value: ValueSelection;
    mask: any;
    onChange: (name: string, values: ValueSelection[]) => void
}

interface IState {
    quantity: string;
    amount: string;
    value: string;
    refType: string;
    showQuantityEditor: boolean;
    showAmountEditor: boolean;
    showValueEditor: boolean;
}

class ValueEditor extends React.Component<IProps & WithStyles<keyof IStyle>, IState> {
    constructor(props: IProps & WithStyles<keyof IStyle>) {
        super(props);
        this.state = {
            quantity: props.value ? this.getNumberStr(props.value.quantity) : '',
            amount: props.value ? this.getNumberStr(props.value.amount) : '',
            value: props.value ? props.value.value : '',
            refType: this.getCardRefById(props.value),
            showQuantityEditor: this.canEditQuantity(props.value),
            showAmountEditor: this.canEditAmount(props.value),
            showValueEditor: this.canEditValue(props.value)
        }
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.value !== this.props.value && nextProps.value) {
            this.setState({
                quantity: nextProps.value.quantity !== 0 ? String(nextProps.value.quantity) : '',
                amount: nextProps.value.amount !== 0 ? String(nextProps.value.amount) : '',
                value: nextProps.value.value,
                refType: this.getCardRefById(nextProps.value),
                showQuantityEditor: this.canEditQuantity(nextProps.value),
                showAmountEditor: this.canEditAmount(nextProps.value),
                showValueEditor: this.canEditValue(nextProps.value)
            })
        }
    }

    public render() {
        return <>
            {(this.state.showAmountEditor || this.state.showQuantityEditor) &&
                <Typography
                    className={this.props.classes.sectionHeader}
                    variant='button'
                >
                    {this.props.value.value}
                </Typography>}

            <div style={{ display: 'flex', flex: 1 }}>
                {this.state.showValueEditor && <div style={{ flex: 1, marginRight: 8 }}>{this.getValueEditor()}</div>}
                {this.state.showQuantityEditor && <TextField style={{ flex: 1, marginRight: 8 }}
                    type="number" label="Quantity"
                    value={this.state.quantity}
                    onChange={e => {
                        this.setState({ quantity: e.target.value });
                        this.props.value.quantity = Number(e.target.value);
                        this.props.onChange(this.props.name, [this.props.value]);
                    }} />}
                {this.state.showAmountEditor && <TextField style={{ flex: 2 }}
                    type="number" label="Amount"
                    value={this.state.amount}
                    onChange={e => {
                        this.setState({ amount: e.target.value })
                        this.props.value.amount = Number(e.target.value);
                        this.props.onChange(this.props.name, [this.props.value]);
                    }} />}
            </div>
        </>
    }

    private getValueEditor() {
        if (this.props.mask) {
            return <MaskedTextInput
                label={this.props.value.tagName}
                mask={this.props.mask || false}
                value={this.state.value}
                onChange={value => {
                    this.setState({ value });
                    this.props.value.value = value;
                    this.props.onChange(this.props.name, [this.props.value]);
                }}
            />
        }
        if (this.state.refType) {
            return <AutoSuggest
                label={this.props.value.tagName}
                value={this.state.value}
                getSuggestions={value =>
                    CardManager.getCardSuggestions(this.state.refType, value)}
                handleChange={(e, value) => {
                    this.setState({ value });
                    this.props.value.value = value;
                    this.props.onChange(this.props.name, [this.props.value]);
                }}
            />
        }
        return <TextField
            fullWidth
            label={this.props.value.tagName}
            value={this.state.value}
            onChange={e => {
                this.setState({ value: e.target.value });
                this.props.value.value = e.target.value;
                this.props.onChange(this.props.name, [this.props.value]);
            }}
        />
    }

    private canEditValue(value: ValueSelection): boolean {
        return !value.value || (!this.canEditAmount(value) && !this.canEditQuantity(value))
    }

    private canEditAmount(value: ValueSelection): boolean {
        return value.amount > 0 || Boolean(value.func)
    }

    private canEditQuantity(value: ValueSelection): boolean {
        return value.quantity > 0;
    }

    private getNumberStr(value): string {
        return value !== 0 ? String(value) : '';
    }

    private getCardRefById(tagValue: ValueSelection): string {
        const tt = tagValue ? ConfigManager.getTagTypeById(tagValue.typeId) : undefined;
        return tt ? tt.cardTypeReferenceName : '';
    }
}

export default decorate(ValueEditor)