import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { WithStyles, TextField } from '@material-ui/core';
import decorate, { IStyle } from './style';
import { connect } from 'react-redux';
import * as CardStore from '../../store/Cards';
import { List as IList } from 'immutable';
import TopBar from '../TopBar';
import InventoryTable from './InventoryTable';
import AccountTable from './AccountTable';
import { CardTagData, CardTypeRecord, CardManager, ConfigManager } from 'sambadna-core';
import { IApplicationState } from '../../store';

type PageProps = { lastCommitTime: any }
    & typeof CardStore.actionCreators
    & WithStyles<keyof IStyle>
    & RouteComponentProps<{}>;

class ReportPage extends React.Component<PageProps, {
    search: string,
    edit: string,
    tags: IList<CardTagData>
}> {

    constructor(props: PageProps) {
        super(props);
        this.state = {
            search: '',
            edit: '',
            tags: IList<CardTagData>()
        };
    }

    public componentWillReceiveProps(nextProps: PageProps) {
        if (nextProps.lastCommitTime !== this.props.lastCommitTime) {
            this.state.tags.clear();
            this.handleEnterKey();
        }
    }

    public render() {
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title="Report"
                />
                <div className={this.props.classes.footer}>
                    <TextField
                        label="Search"
                        value={this.state.edit}
                        onChange={e => this.setState({
                            edit: e.target.value,
                            tags: this.state.tags.count() > 0 ? this.state.tags.clear() : this.state.tags
                        })}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                this.handleEnterKey();
                            } else if (this.state.search) {
                                this.setState({ search: '' });
                            }
                        }}
                    />
                </div>
                <div className={this.props.classes.content}>
                    <AccountTable
                        tags={this.state.tags}
                        searchValue={this.state.search}
                    />
                    <InventoryTable
                        tags={this.state.tags}
                        searchValue={this.state.search}
                    />
                </div>

                {/* <div className={this.props.classes.footer}>
                    <ListItem>
                        <Typography style={{ flex: 1 }} variant="title">Balance</Typography>
                        <Typography variant="title">
                            {this.state.tags
                                .reduce((r, t) => r + t.getBalanceFor(this.state.search), 0).toFixed(2)}
                        </Typography>
                    </ListItem>
                </div> */}
            </div>
        );
    }

    private handleEnterKey() {
        const parts = this.state.edit.split(',').map(x => x.toLowerCase());
        const ct = this.getCardType(parts[0]);
        let sv = parts[0];
        let tags = IList<CardTagData>();
        if (ct) {
            const cardNames = CardManager.getCardsByType(ct.id).map(x => x.name.toLowerCase());
            tags = CardManager.getTags(cardNames.toArray());
            sv = '';
        } else {
            tags = CardManager.getTags(parts)
        };

        this.setState({
            search: sv,
            tags
        });
    }

    private getCardType(value: string): CardTypeRecord | undefined {
        return ConfigManager.getCardTypes().find(x => x.name.toLowerCase() === value.toLowerCase());
    }
}

const mapStateToProps = (state: IApplicationState) => ({
    lastCommitTime: state.cards.lastCommitTime,
});

export default decorate(connect(
    mapStateToProps,
    CardStore.actionCreators
)(ReportPage));