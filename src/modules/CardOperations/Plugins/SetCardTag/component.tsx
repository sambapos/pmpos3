import * as React from 'react';
import { TextField, Button } from 'material-ui';
import CardContent from 'material-ui/Card/CardContent';
import CardActions from 'material-ui/Card/CardActions';
import Typography from 'material-ui/Typography/Typography';

export default class extends React.Component<
    {
        handler: (actionType: string, data: any) => void,
        actionName: string
    },
    { tagName: string, tagValue: string }> {
    constructor(props: any) {
        super(props);
        this.state = { tagName: '', tagValue: '' };
    }
    render() {
        return (
            <div>
                <CardContent>
                    <Typography type="headline">Set Card Tag</Typography>
                    <TextField
                        label="Tag Name"
                        value={this.state.tagName}
                        onChange={e => this.setState({ tagName: e.target.value })}
                    />
                    <br />
                    <TextField
                        label="Tag Value"
                        value={this.state.tagValue}
                        onChange={e => this.setState({ tagValue: e.target.value })}
                    />
                </CardContent>
                <CardActions>
                    <Button
                        onClick={(e) => {
                            this.props.handler(
                                this.props.actionName,
                                {
                                    tagName: this.state.tagName,
                                    tagValue: this.state.tagValue
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