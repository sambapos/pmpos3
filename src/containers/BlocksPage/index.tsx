import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BlocksStore from '../../store/Blocks';
import { uuidv4 } from '../../store/uuid';
import { WithStyles, List as MList, Input, IconButton, Select, MenuItem, ListItem } from 'material-ui';
import { RouteComponentProps } from 'react-router';
import decorate, { Style } from './style';
import TopBar from '../TopBar';
import { Map as IMap, List as IList } from 'immutable';
import Paper from 'material-ui/Paper/Paper';
import Divider from 'material-ui/Divider/Divider';
import Y from 'yjs/dist/y';
import Typography from 'material-ui/Typography/Typography';

export type PageProps =
    { blocks: IMap<string, IList<any>> }
    & WithStyles<keyof Style>
    & typeof BlocksStore.actionCreators
    & RouteComponentProps<{}>;

class BlocksPage extends React.Component<PageProps, { type: string, data: string, bid: string }> {
    constructor(props: PageProps) {
        super(props);
        this.state = { type: '', data: '', bid: '' };
    }

    public displayActions(actions: IMap<string, any>) {
        return (
            <Typography key={actions.get('id')}>
                <Divider />
                aid:{actions.get('id')}
                <br />
                {this.displayPayload(actions.get('payload'))}
            </Typography>);
    }

    public displayPayload(payload: IMap<string, any>) {
        if (!payload || !payload.entrySeq) { return <div>payload</div>; }
        return payload.entrySeq().map(x => {
            return <div key={x[0]}>{x[0] + ':' + x[1]}</div>;
        });
    }

    public handleNewBlock() {
        console.log('blocks', (window as any).protocol.share.blocks);
        let blocks = (window as any).protocol.share.blocks;
        let bid = this.state.type === 'CREATE_BLOCK' ? uuidv4() : this.state.bid;
        let actions = blocks.get(bid);
        console.log('actions', actions);
        if (!actions) {
            blocks.set(bid, Y.Array);
        } else {
            actions.push([{
                bid,
                type: this.state.type,
                data: this.objectify(this.state.data)
            }]);
        }
        this.setState({ type: '', data: '' });
    }

    objectify(data: string) {
        let result = {};
        this.state.data.split(',').map(x => {
            let parts = x.split(':');
            result[parts[0]] = parts[1];
            return result;
        });
        return JSON.stringify(result);
    }
    public render() {
        return (
            <Paper className={this.props.classes.root}>
                <TopBar title="Blocks" />
                <div className={this.props.classes.content}>
                    <MList dense>
                        {
                            this.props.blocks.entrySeq().map(([bid, actions]) => {
                                return (
                                    <ListItem
                                        button
                                        key={bid}
                                        onClick={() => this.setState({ bid })}
                                    >
                                        <Paper className={this.props.classes.listItem}>
                                            {this.state.bid && bid === this.state.bid
                                                ? <Typography type="body2">bid:{bid}</Typography>
                                                : <Typography>bid:{bid}</Typography>
                                            }
                                            {actions.toSeq().map(action =>
                                                this.displayActions(action)
                                            )}
                                        </Paper>
                                    </ListItem>
                                );
                            })
                        }
                    </MList>
                </div>
                <Divider />
                <div className={this.props.classes.footer}>
                    <Select
                        disableUnderline
                        value={this.state.type}
                        style={{ width: '100%', alignItems: 'center', marginLeft: '8px' }}
                        onChange={(e) => this.setState({ type: e.target.value })}
                        input={<Input placeholder="Select action type" />}
                    >
                        <MenuItem value="CREATE_BLOCK">Create Block</MenuItem>
                        <MenuItem value="TAG_BLOCK">Tag Block</MenuItem>
                    </Select>
                    <Divider />
                    <Input
                        style={{ width: '100%', alignItems: 'center', marginLeft: '8px' }}
                        placeholder="Type action data"
                        value={this.state.data}
                        disableUnderline
                        onKeyDown={e => {
                            if (this.state.type && e.key === 'Enter') {
                                e.preventDefault();
                                this.handleNewBlock();
                            }
                        }}
                        onChange={(e) => this.setState({ data: e.target.value })}
                        endAdornment={
                            <IconButton onClick={() => this.handleNewBlock()}>
                                <i className="material-icons">send</i>
                            </IconButton>}
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