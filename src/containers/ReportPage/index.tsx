import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { WithStyles, ListItem, Typography } from 'material-ui';
import decorate, { IStyle } from './style';
import { List as IList } from 'immutable';
import TopBar from '../TopBar';
import TextField from 'material-ui/TextField/TextField';
import InventoryTable from './InventoryTable';
import AccountTable from './AccountTable';
import LocationTable from './LocationTable';
import BalanceTable from './BalanceTable';
import { CardTagData, CardTypeRecord } from 'pmpos-models';
import { CardList } from 'pmpos-modules';

type PageProps =
    WithStyles<keyof IStyle>
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
                                const parts = this.state.edit.split(',');
                                this.setState({
                                    search: parts[0],
                                    tags: this.loadCards(parts)
                                });
                            } else {
                                this.setState({ search: '' });
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

    private loadCards(searchValue: string[]): IList<CardTagData> {
        return CardList.getTags(searchValue);
    }

    private getTables() {
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

    private getCardType(value: string): CardTypeRecord | undefined {
        return CardList.getCardTypes().find(x => x.name.toLowerCase() === value.toLowerCase());
    }

    private getContent() {
        const ct = this.getCardType(this.state.search);
        if (ct) {
            const cardNames = CardList.getCardsByType(ct.id).map(x => x.name);
            const tags = CardList.getTags(cardNames.toArray());
            return (<BalanceTable tags={tags} />);
        }
        return this.getTables();
    }
}

export default decorate(ReportPage);