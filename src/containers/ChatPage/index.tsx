import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as ChatStore from '../../store/Chat';
import { WithStyles, Button, List as MList, ListItem } from 'material-ui';
import { RouteComponentProps } from 'react-router';
import decorate, { Style } from './style';
import TopBar from '../TopBar';
import { List } from 'immutable';

export type PageProps =
    { chat: List<Map<any, any>> }
    & WithStyles<keyof Style>
    & typeof ChatStore.actionCreators
    & RouteComponentProps<{}>;

class ChatPage extends React.Component<PageProps, { message: string, enabled: boolean }> {
    constructor(props: PageProps) {
        super(props);
        console.log('created!!!!!!');
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
            <div className={this.props.classes.root}>
                <TopBar title="Chat" />
                <div className={this.props.classes.content} id="chatDiv">
                    <MList>
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
                <input
                    value={this.state.message}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            (window as any).yChat.share.chat.push([this.state.message]);
                            this.setState({ message: '' });
                        }
                    }}
                    onChange={(e) => this.setState({ message: e.target.value })}
                />
                <Button
                    raised
                    onClick={() => {
                        (window as any).yChat.share.chat.push([this.state.message]);
                        this.setState({ message: '' });
                    }}
                >Send
                </Button>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({ chat: state.chat });

export default decorate(connect(
    mapStateToProps,
    ChatStore.actionCreators
)(ChatPage));