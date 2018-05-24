import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState } from '../../store';
import * as ClientStore from '../../store/Client';
import { WithStyles, Typography, DialogContent, DialogActions, Button } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
import decorate, { IStyle } from './style';
import TopBar from '../TopBar';
import LoginControl from './LoginControl';
import NetworkDialog from './NetworkDialog';

type DispatchType = typeof ClientStore.actionCreators;

export type PageProps =
    ClientStore.IClientState
    & WithStyles<keyof IStyle>
    & DispatchType
    & RouteComponentProps<{}>;

interface IState {
    networkName: string;
    serverName: string;
    branchName: string;
    networkDialogShown: boolean;
}

class LoginPage extends React.Component<PageProps, IState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            networkName: props.networkName,
            serverName: props.serverName,
            branchName: props.branchName,
            networkDialogShown: false
        };
    }

    public render() {
        const { loggedInUser } = this.props;
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title={`Login (${this.state.networkName}${loggedInUser ? '/' : ''}${loggedInUser})`}
                    secondaryCommands={[
                        {
                            icon: 'home',
                            onClick: () => {
                                this.setState({ networkDialogShown: true });
                                this.props.SetModalComponent(this.getDialog());
                            }
                        }
                    ]}
                />
                <div className={this.props.classes.content}>
                    <Typography variant="headline">Welcome to PM-POS</Typography>

                    <LoginControl
                        captureKeys={!this.state.networkDialogShown}
                        onPinEntered={pin => {
                            this.props.SetLoggedInUser(pin);
                            this.props.SetTerminalId(
                                this.props.terminalId,
                                this.state.networkName,
                                this.state.serverName,
                                this.state.branchName);
                            this.props.connectProtocol(
                                this.props.terminalId,
                                this.state.networkName,
                                this.state.serverName,
                                this.state.branchName,
                                pin
                            );
                            if (pin && pin !== '' && this.props.location.pathname === '/login') {
                                this.props.history.push('/');
                            }
                        }}
                    />
                </div>
            </div>
        );
    }

    private getDialog() {
        if (this.props.loggedInUser) {
            return (
                <DialogContent>
                    <div>Please Reload to change the Network</div>
                    <DialogActions>
                        <Button onClick={e => {
                            this.setState({ networkDialogShown: false });
                            this.props.SetModalState(false);
                        }}>Close</Button>
                    </DialogActions>
                </DialogContent>
            );
        }
        return (
            <NetworkDialog
                networkName={this.state.networkName}
                serverName={this.state.serverName}
                branchName={this.state.branchName}
                onClick={(networkName, serverName, branchName) => {
                    this.setState({
                        networkName,
                        serverName,
                        branchName,
                        networkDialogShown: false
                    });
                    this.props.SetModalState(false);
                }} />
        );
    }
}

export default decorate(connect(
    (state: IApplicationState) => state.client,
    ClientStore.actionCreators
)(LoginPage));