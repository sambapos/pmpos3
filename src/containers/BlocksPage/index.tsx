import * as React from 'react';
import { connect } from 'react-redux';
import * as BlockStore from '../../store/Blocks';
import { RouteComponentProps } from 'react-router';
import { WithStyles } from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import TopBar from '../TopBar';
import { Map as IMap } from 'immutable';
import Block from '../../models/Block';

export type PageProps =
    { blocks: IMap<string, Block>, block: Block }
    & WithStyles<keyof Style>
    & typeof BlockStore.actionCreators
    & RouteComponentProps<{}>;

class BlocksPage extends React.Component<PageProps, {}> {
    public render() {
        return (
            <div>
                <TopBar title="Blocks" />
                <ul>
                    {
                        this.props.blocks.entrySeq().map(([id, block]: any[]) => {
                            return (
                                <li key={id}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            if (document) {
                                                this.props.history.push('/block/' + id);
                                            }
                                            e.preventDefault();
                                        }}
                                    >
                                        {id}
                                    </a>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    blocks: state.blocks.get('items'),
    block: state.documents.get('item')
});

export default decorate(connect(
    mapStateToProps,
    BlockStore.actionCreators
)(BlocksPage));