import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BlockStore from '../../store/Blocks';
import { WithStyles, List as MList, ListItem, Input, IconButton, Typography } from 'material-ui';
import { RouteComponentProps } from 'react-router';
import decorate, { Style } from './style';
import TopBar from '../TopBar';
import { List as IList, Map as IMap } from 'immutable';
import Paper from 'material-ui/Paper/Paper';
import Divider from 'material-ui/Divider/Divider';
import * as moment from 'moment';

export type PageProps =
    { chat: IList<IMap<any, any>>, loggedInUser: string }
    & WithStyles<keyof Style>
    & typeof BlockStore.actionCreators
    & RouteComponentProps<{}>;

class ChatPage extends React.Component<PageProps, { message: string, enabled: boolean }> {
    constructor(props: PageProps) {
        super(props);
        this.state = { message: '', enabled: false };
    }

    componentDidUpdate() {
        var objDiv = document.getElementById('chatDiv');
        if (objDiv) {
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    }

    public render() {
        return (
            <Paper className={this.props.classes.root}>
                <TopBar title="Chat" />
                <div className={this.props.classes.content} id="chatDiv">
                    <MList dense>
                        {
                            this.props.chat.sort((x1, x2) => x1.get('date') - x2.get('date')).map(x => {
                                return x && (
                                    <ListItem dense key={x.get('id')}>
                                        <Typography>
                                            {x.get('user') + ' ' + moment(x.get('time')).format('hh:mm:ss')}
                                            <br />
                                            {x.get('message')}
                                        </Typography>
                                    </ListItem>
                                );
                            })
                        }
                    </MList>
                </div>
                <Divider />
                <div className={this.props.classes.footer}>
                    <Input
                        style={{ width: '100%', alignItems: 'center', marginLeft: '8px' }}
                        placeholder={`${this.props.loggedInUser}:Type your message`}
                        value={this.state.message}
                        disableUnderline
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                this.props.addMessage(this.state.message);
                                this.setState({ message: '' });
                            }
                        }}
                        onChange={(e) => this.setState({ message: e.target.value })}
                        endAdornment={
                            <IconButton
                                onClick={() => {
                                    this.props.addMessage(this.state.message);
                                    this.setState({ message: '' });
                                }}
                            >
                                <i className="material-icons">send</i>
                            </IconButton>
                        }
                    />
                </div>
            </Paper>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    chat: state.blocks.get('chat'),
    loggedInUser: state.client.loggedInUser
});

export default decorate(connect(
    mapStateToProps,
    BlockStore.actionCreators
)(ChatPage));