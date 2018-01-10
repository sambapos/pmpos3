import * as React from 'react';
import * as moment from 'moment';
import { RouteComponentProps } from 'react-router';
import { WithStyles, ListItem, Paper, Typography } from 'material-ui';
import decorate, { Style } from './style';
import { List as IList, Map as IMap } from 'immutable';
import TopBar from '../TopBar';
import CardList from '../../modules/CardList';
import TextField from 'material-ui/TextField/TextField';
import CardTagData from '../../models/CardTagData';
import { CardTagRecord } from '../../models/CardTag';

type PageProps =
    WithStyles<keyof Style>
    & RouteComponentProps<{}>;

class TagsPage extends React.Component<PageProps, {
    searchValue: string,
    tags: IList<CardTagData>
}> {

    constructor(props: PageProps) {
        super(props);
        this.state = {
            searchValue: '',
            tags: IList<CardTagData>()
        };
    }

    getSecondaryCommands() {
        let result = [
            {
                icon: 'add', onClick: () => {
                    this.props.history.push('/cardType');
                }
            }
        ];
        return result;
    }

    renderLocation(tags: IList<CardTagData>) {
        let balances = tags.reduce(
            (r, d) => {
                return r.update(d.tag.value, o => {
                    return (o || IMap<string, number>())
                        .update('in', v => (v || 0) + d.tag.getInQuantityFor(this.state.searchValue))
                        .update('out', v => (v || 0) + d.tag.getOutQuantityFor(this.state.searchValue));
                });
            },
            IMap<string, IMap<string, number>>());

        return balances.map((v, k) => {
            return (
                <tr key={k} className={this.props.classes.tableRow}>
                    <td className={this.props.classes.tableCell}>
                        <div>{k}</div>
                    </td>
                    <td className={this.props.classes.tableCellNumber}>
                        {v.get('in')}
                    </td>
                    <td className={this.props.classes.tableCellNumber}>
                        {v.get('out')}
                    </td>
                    <td className={this.props.classes.tableCellNumber}>
                        {(v.get('in') || 0) - (v.get('out') || 0)}
                    </td>
                </tr>
            );
        }).valueSeq();
    }

    renderInventory(tags: IList<CardTagData>) {
        let balance = 0;
        return tags.sort((a, b) => a.time - b.time).map(tagData => {
            balance += tagData.getTotalFor(this.state.searchValue);
            return tagData && (
                <tr key={tagData.id} className={this.props.classes.tableRow}>
                    <td className={this.props.classes.tableCell}>
                        <div>{tagData.display}</div>
                        <div className={this.props.classes.tableSecondary}>
                            {tagData.name + ' ' + moment(tagData.time).format('LLL')}
                        </div>
                    </td>
                    <td className={this.props.classes.tableCellNumber}>
                        {tagData.getInDisplayFor(this.state.searchValue)}
                    </td>
                    <td className={this.props.classes.tableCellNumber}>
                        {tagData.getOutDisplayFor(this.state.searchValue)}
                    </td>
                    <td className={this.props.classes.tableCellNumber}>
                        {balance !== 0 ? balance : ''}
                    </td>
                </tr>
            );
        });
    }

    renderTags(tags: IList<CardTagData>) {
        let balance = 0;
        return tags.sort((a, b) => a.time - b.time).map(tagData => {
            balance += tagData.getBalanceFor(this.state.searchValue);
            return tagData && (
                <tr key={tagData.id} className={this.props.classes.tableRow}>
                    <td className={this.props.classes.tableCell}>
                        <div>{tagData.display}</div>
                        <div className={this.props.classes.tableSecondary}>
                            {tagData.name + ' ' + moment(tagData.time).format('LLL')}
                        </div>
                    </td>
                    <td className={this.props.classes.tableCellNumber}>
                        {tagData.getDebitDisplayFor(this.state.searchValue)}
                    </td>
                    <td className={this.props.classes.tableCellNumber}>
                        {tagData.getCreditDisplayFor(this.state.searchValue)}
                    </td>
                    <td className={this.props.classes.tableCellNumber}>
                        {balance !== 0 ? balance.toFixed(2) : ''}
                    </td>
                </tr>
            );
        });
    }

    loadCards(): IList<CardTagData> {
        return CardList.getTags((tag: CardTagRecord) => {
            let sv = this.state.searchValue.toLowerCase();
            return tag.value.toLowerCase().includes(sv)
                || tag.source.toLowerCase().includes(sv)
                || tag.target.toLowerCase().includes(sv);
        });
    }

    getLocationTable() {
        let firstTag = this.getFirstTag();
        if (!firstTag || !firstTag.isLocation(this.state.searchValue)) {
            return null;
        }
        return (
            <Paper className={this.props.classes.card}>
                <table className={this.props.classes.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>In</th>
                            <th>Out</th>
                            <th>Remaining</th>
                        </tr>
                    </thead>
                    <tbody>{this.renderLocation(this.state.tags)}</tbody>
                </table>
            </Paper>
        );
    }

    getFirstTag(): CardTagData | undefined {
        return this.state.tags.first();
    }

    getAccountTable() {
        let firstTag = this.getFirstTag();
        if (!firstTag) { return null; }
        return (
            <Paper className={this.props.classes.card}>
                <table className={this.props.classes.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Debit</th>
                            <th>Credit</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>{this.renderTags(this.state.tags)}</tbody>
                </table>
            </Paper>
        );
    }

    getInventoryTable() {
        let firstTag = this.getFirstTag();
        if (!firstTag || !firstTag.isInventory(this.state.searchValue)) {
            return null;
        }
        return (
            <Paper className={this.props.classes.card}>
                <table className={this.props.classes.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>In</th>
                            <th>Out</th>
                            <th>Remaining</th>
                        </tr>
                    </thead>
                    <tbody>{this.renderInventory(this.state.tags)}</tbody>
                </table>
            </Paper>
        );
    }

    public render() {
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title="Tags"
                    secondaryCommands={this.getSecondaryCommands()}
                />
                <div className={this.props.classes.footer}>
                    <TextField
                        label="Search"
                        value={this.state.searchValue}
                        onChange={e => this.setState({
                            searchValue: e.target.value,
                            tags: this.state.tags.count() > 0 ? this.state.tags.clear() : this.state.tags
                        })}
                        onKeyDown={
                            e => e.key === 'Enter'
                                && this.setState(
                                    {
                                        tags: this.loadCards()
                                    }
                                )
                        }
                    />
                </div>
                <div className={this.props.classes.content}>
                    {this.getAccountTable()}
                    {this.getInventoryTable()}
                    {this.getLocationTable()}
                </div>

                <div className={this.props.classes.footer}>
                    <ListItem>
                        <Typography style={{ flex: 1 }} type="title">Balance</Typography>
                        <Typography type="title">
                            {this.state.tags.reduce(
                                (r, t) => r + t.getBalanceFor(this.state.searchValue),
                                0)
                                .toFixed(2)}
                        </Typography>
                    </ListItem>
                </div>
            </div>
        );
    }
}

export default decorate(TagsPage);