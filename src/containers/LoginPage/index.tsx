import * as React from 'react';
import * as Extender from '../../lib/Extender';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as ClientStore from '../../store/Client';
import * as ChatStore from '../../store/Chat';
import { WithStyles } from 'material-ui';
import { RouteComponentProps } from 'react-router';
import decorate, { Style } from './style';
import TopBar from '../TopBar';
import Typography from 'material-ui/Typography/Typography';
import LoginControl from './LoginControl';
import TextField from 'material-ui/TextField/TextField';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';
import Button from 'material-ui/Button/Button';
import DialogTitle from 'material-ui/Dialog/DialogTitle';

type DispatchType = typeof ClientStore.actionCreators & typeof ChatStore.actionCreators;

export type PageProps =
    ClientStore.ClientState
    & WithStyles<keyof Style>
    & DispatchType
    & RouteComponentProps<{}>;

class VenueDialog extends React.Component<
    { venueName: string, onClick: (name: string) => void },
    { venueName: string }> {

    constructor(props: any) {
        super(props);
        this.state = { venueName: props.venueName };
    }

    render() {
        return (
            <div>
                <DialogTitle>Select Venue</DialogTitle>
                <DialogContent>
                    <TextField label="Venue Name"
                        margin="dense"
                        value={this.state.venueName}
                        onChange={e => this.setState({ venueName: e.target.value })} />
                    <DialogActions>
                        <Button onClick={e => {
                            this.props.onClick(this.state.venueName);
                        }}>Submit</Button>
                    </DialogActions>
                </DialogContent>
            </div>
        );
    }
}

class LoginPage extends React.Component<PageProps, { venueName: string }> {
    constructor(props: PageProps) {
        super(props);
        this.state = { venueName: props.venueName };
    }

    getDialog() {
        if (this.props.loggedInUser) {
            return (
                <DialogContent>
                    <div>Please Reload to change the Venue</div>
                    <DialogActions>
                        <Button onClick={e => {
                            this.props.SetModalState(false);
                        }}>Close</Button>
                    </DialogActions>
                </DialogContent>
            );
        }
        return (
            <VenueDialog
                venueName={this.state.venueName}
                onClick={venueName => {
                    this.setState({ venueName });
                    this.props.SetModalState(false);
                }} />
        );
    }

    public render() {
        let { loggedInUser } = this.props;
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title={`Login (${this.state.venueName}${loggedInUser ? '/' : ''}${loggedInUser})`}
                    secondaryCommands={[
                        {
                            icon: 'home',
                            onClick: () =>
                                this.props.SetModalComponent(this.getDialog())
                        }
                    ]}
                />
                <div className={this.props.classes.content}>
                    <Typography variant="headline">Welcome to PM-POS</Typography>

                    <LoginControl
                        onPinEntered={pin => {
                            this.props.SetLoggedInUser(pin);
                            this.props.SetTerminalId(this.props.terminalId, this.state.venueName);
                            this.props.connectProtocol(
                                this.props.terminalId, this.state.venueName, pin
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
}

export default decorate(connect(
    (state: ApplicationState) => state.client,
    Extender.extend(ClientStore.actionCreators, ChatStore.actionCreators)
)(LoginPage));