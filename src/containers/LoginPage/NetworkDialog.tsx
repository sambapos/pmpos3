import * as React from 'react';
import { DialogTitle, DialogContent, TextField, DialogActions, Button } from 'material-ui';

export default class NetworkDialog extends React.Component<
    { networkName: string, onClick: (name: string) => void },
    { networkName: string }> {

    constructor(props: any) {
        super(props);
        this.state = { networkName: props.networkName };
    }

    render() {
        return (
            <div>
                <DialogTitle>Select Network</DialogTitle>
                <DialogContent>
                    <TextField label="Network Name"
                        margin="dense"
                        value={this.state.networkName}
                        onChange={e => this.setState({ networkName: e.target.value })} />
                    <DialogActions>
                        <Button onClick={e => {
                            this.props.onClick(this.state.networkName);
                        }}>Submit</Button>
                    </DialogActions>
                </DialogContent>
            </div>
        );
    }
}
