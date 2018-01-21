import * as React from 'react';
import { TextField, Button, DialogContent, DialogTitle, DialogActions } from 'material-ui';
import * as shortid from 'shortid';
import AutoSuggest from './AutoSuggest';
import CardList from '../../../CardList';
import { CardTagRecord } from '../../../../models/CardTag';
import { Fragment } from 'react';

export default class extends React.Component<
    {
        success: (actionType: string, data: any) => void,
        cancel: () => void,
        actionName: string,
        current?: CardTagRecord
    },
    {
        name: string, value: string, quantity: number, unit: string,
        amount: number, source: string, target: string
    }> {
    constructor(props: any) {
        super(props);
        this.state = {
            name: '', value: '', quantity: 0, unit: '',
            amount: 0, source: '', target: ''
        };
    }
    componentDidMount() {
        if (this.props.current) {
            this.setState({
                name: this.props.current.name,
                value: this.props.current.value,
                quantity: this.props.current.quantity,
                unit: this.props.current.unit,
                amount: this.props.current.amount,
                source: this.props.current.source,
                target: this.props.current.target
            });
        }
    }

    render() {
        return (
            <Fragment>
                <DialogTitle>Set Card Tag</DialogTitle>
                <DialogContent>
                    {Boolean(!this.props.current || !this.props.current.name) &&
                        <TextField
                            fullWidth
                            label="Tag Name"
                            value={this.state.name}
                            onChange={e => this.setState({ name: e.target.value })}
                        />}
                    <AutoSuggest
                        label="Tag Value"
                        value={this.props.current ? this.props.current.value || '' : ''}
                        getSuggestions={value => CardList.getCardSuggestions(this.state.name, value)}
                        handleChange={(e, value) => this.setState({ value })}
                    />
                    <TextField
                        fullWidth
                        label="Quantity"
                        value={this.state.quantity}
                        onChange={e => this.setState({ quantity: Number(e.target.value) })}
                    />
                    <TextField
                        fullWidth
                        label="Unit"
                        value={this.state.unit}
                        onChange={e => this.setState({ unit: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Amount"
                        value={this.state.amount}
                        onChange={e => this.setState({ amount: Number(e.target.value) })}
                    />
                    <TextField
                        fullWidth
                        label="Source"
                        value={this.state.source}
                        onChange={e => this.setState({ source: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Target"
                        value={this.state.target}
                        onChange={e => this.setState({ target: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={() => this.props.cancel()}>Cancel</Button> */}
                    <Button
                        onClick={(e) => {
                            this.props.success(
                                this.props.actionName,
                                {
                                    id: shortid.generate(),
                                    name: this.state.name || `_${shortid.generate()}`,
                                    value: this.state.value,
                                    quantity: this.state.quantity,
                                    unit: this.state.unit,
                                    amount: this.state.amount,
                                    source: this.state.source,
                                    target: this.state.target
                                });
                        }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Fragment>
        );
    }
}