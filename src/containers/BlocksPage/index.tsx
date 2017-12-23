import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BlocksStore from '../../store/Blocks';
import { uuidv4 } from '../../store/uuid';
import { WithStyles, List as MList, Input, IconButton } from 'material-ui';
import { RouteComponentProps } from 'react-router';
import decorate, { Style } from './style';
import TopBar from '../TopBar';
import { Map as IMap, List as IList } from 'immutable';
import Paper from 'material-ui/Paper/Paper';
import Divider from 'material-ui/Divider/Divider';

export type PageProps =
    { blocks: IMap<string, IList<any>> }
    & WithStyles<keyof Style>
    & typeof BlocksStore.actionCreators
    & RouteComponentProps<{}>;

class BlocksPage extends React.Component<PageProps, { type: string, data: string }> {
    constructor(props: PageProps) {
        super(props);
        this.state = { type: '', data: '' };
    }

    public displayAction(action: IMap<string, any>) {
        return (
            <div key={action.get('id')}>
                aid:{action.get('id')}
                <br />
                {this.displayPayload(action.get('payload'))}
            </div>);
    }

    public displayPayload(payload: IMap<string, any>) {
        if (!payload.entrySeq) { return <div>payload</div>; }
        return payload.entrySeq().map(x => {
            return <div key={x[0]}>{x[0] + ':' + x[1]}</div>;
        });
    }

    public render() {
        return (
            <Paper className={this.props.classes.root}>
                <TopBar title="Blocks" />
                <div className={this.props.classes.content}>
                    <MList dense>
                        {
                            this.props.blocks.entrySeq().map(([ticketId, actions]) => {
                                return (
                                    <Paper key={ticketId}>
                                        <div>tid:{ticketId}</div><br />
                                        {actions.toSeq().map(action =>
                                            this.displayAction(action)
                                        )}
                                    </Paper>
                                );
                            })
                        }
                    </MList>
                </div>
                <Divider />
                <div className={this.props.classes.footer}>
                    <Input
                        style={{ width: '100%', alignItems: 'center', marginLeft: '8px' }}
                        placeholder="Type action name"
                        value={this.state.type}
                        disableUnderline
                        onChange={(e) => this.setState({ type: e.target.value })}
                    />
                    <Divider />
                    <Input
                        style={{ width: '100%', alignItems: 'center', marginLeft: '8px' }}
                        placeholder="Type action data"
                        value={this.state.data}
                        disableUnderline
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                (window as any).protocol.share.blocks.set(
                                    uuidv4(),
                                    {
                                        type: this.state.type,
                                        data: this.state.data
                                    });
                                this.setState({ type: '', data: '' });
                            }
                        }}
                        onChange={(e) => this.setState({ data: e.target.value })}
                        endAdornment={
                            <IconButton>
                                <i className="material-icons">send</i>
                            </IconButton>
                        }
                    />
                </div>
            </Paper>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({ blocks: state.blocks });

export default decorate(connect(
    mapStateToProps,
    BlocksStore.actionCreators
)(BlocksPage));