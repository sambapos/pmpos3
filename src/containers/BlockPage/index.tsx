import * as React from 'react';
import { connect } from 'react-redux';
import * as BlockStore from '../../store/Blocks';
import { RouteComponentProps } from 'react-router';
import { WithStyles } from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import TopBar from '../TopBar';
import Block from '../../models/Block';
import BlockTags from './BlockTags';
import Paper from 'material-ui/Paper/Paper';

export type PageProps =
    {
        isLoading: boolean,
        block: Block
    }
    & WithStyles<keyof Style>
    & typeof BlockStore.actionCreators
    & RouteComponentProps<{ id: string }>;

class BlockPage extends React.Component<PageProps, {}> {
    public componentDidMount() {
        this.props.loadBlock(this.props.match.params.id);
    }
    public render() {
        if (this.props.isLoading || !this.props.block) { return <div>Loading</div>; }
        return (
            <div className={this.props.classes.content}>
                <TopBar
                    title="Block"
                    menuCommand={{ icon: 'close', onClick: () => { this.props.history.goBack(); } }}
                />
                <Paper className={this.props.classes.paper}>
                    <p>{this.props.block.id}</p>
                    <BlockTags block={this.props.block} />
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    block: state.blocks.get('item'),
    isLoading: state.blocks.get('isLoading')
});

export default decorate(connect(
    mapStateToProps,
    BlockStore.actionCreators
)(BlockPage));