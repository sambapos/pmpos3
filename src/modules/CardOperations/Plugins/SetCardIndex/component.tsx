import * as React from 'react';
import { TextField, Button, DialogContent, DialogTitle, DialogActions } from 'material-ui';
import { Fragment } from 'react';
import { CardRecord } from '../../../../models/Card';

export default class extends React.Component<
    {
        success: (actionType: string, data: any) => void,
        cancel: () => void,
        actionName: string,
        current?: CardRecord
    },
    { index: string }> {
    constructor(props: any) {
        super(props);
        this.state = { index: '' };
    }
    componentDidMount() {
        if (this.props.current) {
            this.setState({ index: this.props.current.index.toString() });
        }
    }

    render() {
        return (
            <Fragment>
                <DialogTitle>Set Card Index</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Index"
                        type="number"
                        value={this.state.index}
                        onChange={e => this.setState({ index: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={() => this.props.cancel()}>Cancel</Button> */}
                    <Button
                        onClick={(e) => {
                            this.props.success(
                                this.props.actionName,
                                {
                                    index: Number(this.state.index)
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