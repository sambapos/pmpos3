import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { WithStyles, ListItem, Typography } from 'material-ui';
import decorate, { Style } from './style';
import { List as IList } from 'immutable';
import TopBar from '../TopBar';
import CardList from '../../modules/CardList';
import TextField from 'material-ui/TextField/TextField';
import CardTagData from '../../models/CardTagData';
import InventoryTable from './InventoryTable';
import AccountTable from './AccountTable';
import LocationTable from './LocationTable';
import { CardTypeRecord } from '../../models/CardType';
import BalanceTable from './BalanceTable';

type PageProps =
    WithStyles<keyof Style>
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

    loadCards(searchValue: string[]): IList<CardTagData> {
        return CardList.getTags(searchValue);
    }

    getTables() {
        return (
            <div>
                <LocationTable
                    tags={this.state.tags}
                    searchValue={this.state.search}
                />
                <AccountTable
                    tags={this.state.tags}
                    searchValue={this.state.search}
                />
                <InventoryTable
                    tags={this.state.tags}
                    searchValue={this.state.search}
                />
            </div>
        );
    }

    getCardType(value: string): CardTypeRecord | undefined {
        return CardList.getCardTypes().find(x => x.name.toLowerCase() === value.toLowerCase());
    }

    getContent() {
        let ct = this.getCardType(this.state.search);
        if (ct) {
            let cardNames = CardList.getCardsByType(ct.id).map(x => x.name);
            let tags = CardList.getTags(cardNames.toArray());
            return (<BalanceTable tags={tags} />);
        }
        return this.getTables();
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
                                let parts = this.state.edit.split(',');
                                this.setState({
                                    search: parts[0],
                                    tags: this.loadCards(parts)
                                });
                            }
                        }}
                    />
                </div>
                <div className={this.props.classes.content}>
                    {this.getContent()}
                </div>

                <div className={this.props.classes.footer}>
                    <ListItem>
                        <Typography style={{ flex: 1 }} variant="title">Balance</Typography>
                        <Typography variant="title">
                            {this.state.tags
                                .reduce((r, t) => r + t.getBalanceFor(this.state.search), 0).toFixed(2)}
                        </Typography>
                    </ListItem>
                </div>
            </div>
        );
    }
}

export default decorate(ReportPage);