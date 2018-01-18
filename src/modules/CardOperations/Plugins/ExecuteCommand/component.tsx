import * as React from 'react';
import { TextField, Button } from 'material-ui';
import CardContent from 'material-ui/Card/CardContent';
import CardActions from 'material-ui/Card/CardActions';
import Typography from 'material-ui/Typography/Typography';
import * as shortid from 'shortid';

export default class extends React.Component<
    {
        handler: (actionType: string, data: any) => void,
        actionName: string
    },
    {
        name: string, parameters: string
    }> {

    constructor(props: any) {
        super(props);
        this.state = {
            name: '', parameters: ''
        };
    }

    render() {

        return (
            <div>
                <CardContent>
                    <Typography type="headline">Execute Command</Typography>
                    {<TextField
                        label="Name"
                        value={this.state.name}
                        onChange={e => this.setState({ name: e.target.value })}
                    />}
                    <TextField
                        label="Parameters"
                        value={this.state.parameters}
                        onChange={e => this.setState({ parameters: e.target.value })}
                    />
                </CardContent>
                <CardActions>
                    <Button
                        onClick={(e) => {
                            this.props.handler(
                                this.props.actionName,
                                {
                                    id: shortid.generate(),
                                    name: this.state.name,
                                    parameters: this.state.parameters.split(',')
                                        .reduce(
                                        (r, p) => {
                                            let parts = p.split(',');
                                            r[parts[0]] = parts[1];
                                            return r;
                                        },
                                        {})
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