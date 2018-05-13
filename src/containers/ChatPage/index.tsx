import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState } from '../../store';
import { WithStyles, List as MList, ListItem, Input, IconButton, Typography } from 'material-ui';
import { RouteComponentProps } from 'react-router';
import decorate, { IStyle } from './style';
import TopBar from '../TopBar';
import Paper from 'material-ui/Paper/Paper';
import Divider from 'material-ui/Divider/Divider';
import * as ChatStore from '../../store/Chat';
import * as moment from 'moment';

export type PageProps =
    { chat: ChatStore.StateRecord, loggedInUser: string }
    & WithStyles<keyof IStyle>
    & typeof ChatStore.actionCreators
    & RouteComponentProps<{}>;

class ChatPage extends React.Component<PageProps, {
    message: string,
    enabled: boolean
}> {
    constructor(props: PageProps) {
        super(props);
        this.state = { message: '', enabled: false };
    }

    public componentDidUpdate() {
        const objDiv = document.getElementById('chatDiv');
        if (objDiv) {
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    }

    public render() {
        return (
            <div className={this.props.classes.root}>
                <TopBar title="Chat" />
                <Paper className={this.props.classes.content} id="chatDiv">
                    <MList dense>
                        {
                            this.props.chat.messages.sort((x1, x2) => this.sort(x1, x2)).map(x => {
                                return x && (
                                    <ListItem dense key={x.id}>
                                        <Typography>
                                            {x.user + ' ' + moment(x.time).format('hh:mm:ss') + ' l:' + x.lamport}
                                            <br />
                                            {x.message}
                                        </Typography>
                                    </ListItem>
                                );
                            })
                        }
                    </MList>
                </Paper>
                <Paper className={this.props.classes.footer}>
                    <Divider />
                    <Input
                        style={{ width: '100%', alignItems: 'center', marginLeft: '8px' }}
                        placeholder={`${this.props.loggedInUser}:Type your message`}
                        value={this.state.message}
                        disableUnderline
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                this.addMessage();
                            }
                        }}
                        onChange={(e) => this.setState({ message: e.target.value })}
                        endAdornment={
                            <IconButton
                                onClick={() => {
                                    this.addMessage();
                                }}
                            >
                                <i className="material-icons">send</i>
                            </IconButton>
                        }
                    />
                </Paper>
            </div>
        );
    }

    private sort(a: ChatStore.IMessage, b: ChatStore.IMessage) {
        return a.lamport !== b.lamport
            ? a.lamport - b.lamport
            : a.time - b.time;
    }

    private addMessage() {
        this.props.addMessage(this.state.message);
        this.setState({ message: '' });
    }
}

const mapStateToProps = (state: IApplicationState) => ({
    chat: state.chat,
    loggedInUser: state.client.loggedInUser
});

export default decorate(connect(
    mapStateToProps,
    ChatStore.actionCreators
)(ChatPage));