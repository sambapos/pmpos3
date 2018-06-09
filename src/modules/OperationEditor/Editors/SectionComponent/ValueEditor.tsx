import * as React from "react";
import { ValueSelection } from "./ValueSelection";
import { Typography, TextField } from "@material-ui/core";

interface IProps {
    name: string;
    value: ValueSelection;
    onChange: (name: string, values: ValueSelection[]) => void
}

interface IState {
    quantity: string;
    amount: string;
}

export default class extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            quantity: props.value ? String(props.value.quantity) : '',
            amount: props.value ? String(props.value.amount) : ''
        }
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.value !== this.props.value && nextProps.value) {
            this.setState({
                quantity: String(nextProps.value.quantity),
                amount: String(nextProps.value.quantity)
            })
        }
    }

    public render() {
        return <>
            <Typography variant='title'>{this.props.value.value} </Typography>
            <div style={{ display: 'flex', flex: 1, marginTop: 8, marginBottom: 8 }}>
                <TextField style={{ flex: 1, marginRight: 8 }}
                    type="number" label="Quantity"
                    value={this.state.quantity}
                    onChange={e => {
                        this.setState({ quantity: e.target.value });
                        this.props.value.quantity = Number(e.target.value);
                        this.props.onChange(this.props.name, [this.props.value]);
                    }} />
                <TextField style={{ flex: 2 }}
                    type="number" label="Amount"
                    value={this.state.amount}
                    onChange={e => {
                        this.setState({ amount: e.target.value })
                        this.props.value.amount = Number(e.target.value);
                        this.props.onChange(this.props.name, [this.props.value]);
                    }} />
            </div>
        </>
    }
}