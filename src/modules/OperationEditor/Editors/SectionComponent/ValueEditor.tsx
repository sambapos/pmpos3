import * as React from "react";
import { ValueSelection } from "./ValueSelection";
import { Typography, TextField } from "@material-ui/core";
import MaskedTextInput from "../../../../components/MaskedTextInput";
import { ConfigManager, CardManager } from "pmpos-core";
import AutoSuggest from "../../../../components/AutoSuggest";

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
    showQuantity: boolean;
    showAmount: boolean;
}

export default class extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            quantity: props.value ? this.getNumberStr(props.value.quantity) : '',
            amount: props.value ? this.getNumberStr(props.value.amount) : '',
            value: props.value ? props.value.value : '',
            refType: this.getCardRefById(props.value),
            showQuantity: props.value.quantity > 0,
            showAmount: props.value.amount > 0 || Boolean(props.value.func)
        }
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.value !== this.props.value && nextProps.value) {
            this.setState({
                quantity: nextProps.value.quantity !== 0 ? String(nextProps.value.quantity) : '',
                amount: nextProps.value.amount !== 0 ? String(nextProps.value.amount) : '',
                value: nextProps.value.value,
                refType: this.getCardRefById(nextProps.value),
                showQuantity: nextProps.value.quantity > 0,
                showAmount: nextProps.value.amount > 0 || Boolean(nextProps.value.func)
            })
        }
    }

    public render() {
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

        if (!this.state.showQuantity && !this.state.showAmount) {
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
        return <>
            <Typography variant='button'>{this.props.value.value} </Typography>
            <div style={{ display: 'flex', flex: 1, marginTop: 8, marginBottom: 8 }}>
                {this.state.showQuantity && <TextField style={{ flex: 1, marginRight: 8 }}
                    type="number" label="Quantity"
                    value={this.state.quantity}
                    onChange={e => {
                        this.setState({ quantity: e.target.value });
                        this.props.value.quantity = Number(e.target.value);
                        this.props.onChange(this.props.name, [this.props.value]);
                    }} />}
                {this.state.showAmount && <TextField style={{ flex: 2 }}
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

    private getNumberStr(value): string {
        return value !== 0 ? String(value) : '';
    }

    private getCardRefById(tagValue: ValueSelection): string {
        const tt = tagValue ? ConfigManager.getTagTypeById(tagValue.typeId) : undefined;
        return tt ? tt.cardTypeReferenceName : '';
    }
}