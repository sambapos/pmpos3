import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as ChatStore from '../../store/Chat';
import { WithStyles, List as MList, ListItem, Input, IconButton } from 'material-ui';
import { RouteComponentProps } from 'react-router';
import decorate, { Style } from './style';
import TopBar from '../TopBar';
import { List as IList, Map as IMap } from 'immutable';
import Paper from 'material-ui/Paper/Paper';
import Divider from 'material-ui/Divider/Divider';

export type PageProps =
    { chat: IList<IMap<any, any>> }
    & WithStyles<keyof Style>
    & typeof ChatStore.actionCreators
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
                            this.props.chat.map(x => {
                                return x && (
                                    <ListItem key={x.get('id')}>
                                        {x.get('message')}
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
                        placeholder="Type your message"
                        value={this.state.message}
                        disableUnderline
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                (window as any).protocol.share.chat.push([this.state.message]);
                                this.setState({ message: '' });
                            }
                        }}
                        onChange={(e) => this.setState({ message: e.target.value })}
                        endAdornment={
                            <IconButton
                                onClick={() => {
                                    (window as any).protocol.share.chat.push([this.state.message]);
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

const mapStateToProps = (state: ApplicationState) => ({ chat: state.chat });

export default decorate(connect(
    mapStateToProps,
    ChatStore.actionCreators
)(ChatPage));