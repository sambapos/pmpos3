import * as React from 'react';
import { DialogTitle, DialogContent, TextField, DialogActions, Button } from '@material-ui/core';

interface IProps {
    networkName: string;
    serverName: string;
    branchName: string;
    onClick: (networkName: string, serverName: string, branchName: string) => void;
}

interface IState {
    networkName: string;
    serverName: string;
    branchName: string;
}

export default class NetworkDialog extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            networkName: props.networkName,
            serverName: props.serverName,
            branchName: props.branchName
        };
    }

    public render() {
        return (
            <div>
                <DialogTitle>Select Network</DialogTitle>
                <DialogContent>

                    <TextField label="Network Name"
                        fullWidth
                        value={this.state.networkName}
                        onChange={e => this.setState({ networkName: e.target.value })} />
                    <TextField label="Branch Name"
                        fullWidth
                        value={this.state.branchName}
                        onChange={e => this.setState({ branchName: e.target.value })} />
                    <TextField label="Server Name"
                        fullWidth
                        value={this.state.serverName}
                        onChange={e => this.setState({ serverName: e.target.value })} />
                    <DialogActions>
                        <Button onClick={e => {
                            this.props.onClick(
                                this.state.networkName, this.state.serverName, this.state.branchName
                            );
                        }}>Submit</Button>
                    </DialogActions>
                </DialogContent>
            </div>
        );
    }
}
