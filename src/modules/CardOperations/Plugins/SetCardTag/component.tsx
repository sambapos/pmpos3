import * as React from 'react';
import { TextField, Button } from 'material-ui';
import CardContent from 'material-ui/Card/CardContent';
import CardActions from 'material-ui/Card/CardActions';
import Typography from 'material-ui/Typography/Typography';
import { CardTagRecord } from '../../../../models/Card';
import * as shortid from 'shortid';

export default class extends React.Component<
    {
        handler: (actionType: string, data: any) => void,
        actionName: string,
        current?: CardTagRecord
    },
    { name: string, value: string, quantity: number, unit: string, debit: number, credit: number }> {
    constructor(props: any) {
        super(props);
        this.state = { name: '', value: '', quantity: 0, unit: '', debit: 0, credit: 0 };
    }
    componentDidMount() {
        if (this.props.current) {
            this.setState({
                name: this.props.current.name,
                value: this.props.current.value,
                quantity: this.props.current.quantity,
                unit: this.props.current.unit,
                debit: this.props.current.debit,
                credit: this.props.current.credit
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
                    <br />
                    <TextField
                        label={this.props.current ? this.props.current.name : 'Tag Value'}
                        value={this.state.value}
                        onChange={e => this.setState({ value: e.target.value })}
                    />
                    <br />
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
                        label="Debit"
                        value={this.state.debit}
                        onChange={e => this.setState({ debit: Number(e.target.value) })}
                    />
                    <TextField
                        label="Credit"
                        value={this.state.credit}
                        onChange={e => this.setState({ credit: Number(e.target.value) })}
                    />
                </CardContent>
                <CardActions>
                    <Button
                        onClick={(e) => {
                            this.props.handler(
                                this.props.actionName,
                                {
                                    name: this.state.name || `_${shortid.generate()}`,
                                    value: this.state.value,
                                    quantity: this.state.quantity,
                                    unit: this.state.unit,
                                    debit: this.state.debit,
                                    credit: this.state.credit
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