import * as React from 'react';
import { TextField, Button } from 'material-ui';
import CardContent from 'material-ui/Card/CardContent';
import CardActions from 'material-ui/Card/CardActions';
import Typography from 'material-ui/Typography/Typography';
import * as shortid from 'shortid';
import AutoSuggest from './AutoSuggest';
import CardList from '../../../CardList';
import { CardTagRecord } from '../../../../models/CardTag';

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
            <div>
                <CardContent>
                    <Typography type="headline">Set Card Tag</Typography>
                    {!this.props.current && <TextField
                        label="Tag Name"
                        value={this.state.name}
                        onChange={e => this.setState({ name: e.target.value })}
                    />}
                    <AutoSuggest
                        label="Tag Value"
                        value={this.props.current ? this.props.current.value : ''}
                        getSuggestions={value => CardList.getCardSuggestions(this.state.name, value)}
                        handleChange={(e, value) => this.setState({ value })}
                    />
                    <TextField
                        label="Quantity"
                        value={this.state.quantity}
                        onChange={e => this.setState({ quantity: Number(e.target.value) })}
                    />
                    <TextField
                        label="Unit"
                        value={this.state.unit}
                        onChange={e => this.setState({ unit: e.target.value })}
                    />
                    <TextField
                        label="Amount"
                        value={this.state.amount}
                        onChange={e => this.setState({ amount: Number(e.target.value) })}
                    />
                    <TextField
                        label="Source"
                        value={this.state.source}
                        onChange={e => this.setState({ source: e.target.value })}
                    />
                    <TextField
                        label="Target"
                        value={this.state.target}
                        onChange={e => this.setState({ target: e.target.value })}
                    />
                </CardContent>
                <CardActions>
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
                </CardActions>

            </div>
        );
    }
}