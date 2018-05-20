import * as React from 'react';
import { connect } from 'react-redux';
import * as CardStore from '../../store/Cards';
import * as ClientStore from '../../store/Client';
import * as Extender from '../../lib/Extender';
import { List } from 'immutable';
import { RouteComponentProps } from 'react-router';
import {
    WithStyles, Paper, Button,
    AppBar, Tab, Tabs, DialogTitle, Divider, DialogActions
} from 'material-ui';
import decorate, { IStyle } from './style';
import { IApplicationState } from '../../store/index';
import { Map as IMap, List as IList } from 'immutable';
import TopBar from '../TopBar';
import CardSelector from '../../components/CardSelector';
import { CardRecord, CardTypeRecord, CardTag, CardTagRecord } from 'pmpos-models';
import { ConfigManager } from 'pmpos-modules';
import { TerminalManager } from 'pmpos-modules';

type PageProps =
    {
        cards: IList<CardRecord>,
        card: CardRecord,
        cardTypes: IMap<string, CardTypeRecord>,
        rootCardTypes: string[],
        currentCardType: CardTypeRecord,
        cardListScrollTop: number,
        searchValue: string,
        showAllCards: boolean,
        tabIndex: number
    }
    & WithStyles<keyof IStyle>
    & typeof CardStore.actionCreators
    & typeof ClientStore.actionCreators
    & RouteComponentProps<{}>;

interface IState {
    currentCardType: CardTypeRecord;
    searchValueText: string;
    tabs: string[];
}

class CardsPage extends React.Component<PageProps, IState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            currentCardType: props.currentCardType,
            searchValueText: props.searchValue,
            tabs: this.getTabValues(props.currentCardType),
        };
    }

    public componentWillReceiveProps(nextProps: PageProps) {
        if (nextProps.currentCardType.name !== this.state.currentCardType.name) {
            this.setState({
                currentCardType: nextProps.currentCardType,
                tabs: this.getTabValues(nextProps.currentCardType),
            });
        }
        if (nextProps.cards !== this.props.cards
            || nextProps.searchValue !== this.props.searchValue
            || nextProps.showAllCards !== this.props.showAllCards) {
            this.setState({
                searchValueText: nextProps.searchValue,
            });
        }
    }

    public render() {
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title={this.state.currentCardType ? this.state.currentCardType.name : 'Cards'}
                    secondaryCommands={this.getSecondaryCommands()}
                />
                {this.state.currentCardType && <Paper className={this.props.classes.content}>
                    <CardSelector
                        sourceCards={this.props.cards.filter(x => !x.isClosed)}
                        sourceCardType={this.props.currentCardType}
                        cardType={this.state.tabs[this.props.tabIndex]}
                        scrollTop={this.props.cardListScrollTop}
                        searchValue={this.props.searchValue}
                        onSearchValueChange={sv => this.props.setSearchValue(sv)}
                        onScrollChange={sp => this.props.setCardListScrollTop(sp)}
                        onSaveSortOrder={items => this.onSaveSortOrder(items)}
                        onSelectCard={(card, cardType, cards) => this.handleCardSelection(card, cardType, cards)}
                    />
                </Paper>}
                {this.state.tabs.length > 1 &&
                    <div className={this.props.classes.tabBar}>
                        <AppBar position="static" color="default" >
                            <Tabs
                                value={this.props.tabIndex}
                                onChange={(e, v) => this.handleChangeListIndex(v)}
                                indicatorColor="primary"
                                textColor="primary"
                                fullWidth
                            >
                                {
                                    this.state.tabs.map(t => (
                                        <Tab key={'t_' + t} label={t} />
                                    ))
                                }
                            </Tabs>
                        </AppBar></div>}
            </div>
        );
    }

    private handleChangeListIndex = index => {
        this.props.setTabIndex(index);
    }

    // private updateSearch() {
    //     this.props.setSearchValue(this.state.searchValueText);
    // }

    private displayCard(c: CardRecord) {
        this.props.history.push(
            process.env.PUBLIC_URL + '/card/' + c.id);
    }

    private addNewCard(tags: CardTag[]) {
        if (this.props.currentCardType.id) {
            this.props.addCard(this.props.currentCardType, tags);
            this.props.history.push(process.env.PUBLIC_URL + '/card');
        }
    }

    // todo: BURAYA BAK
    private onSaveSortOrder = (list: CardRecord[]) => {
        for (let index = 0; index < list.length; index++) {
            const item = list[index];
            if (item.index !== index) {
                list[index] = item.set('index', index);
                TerminalManager.openCard('', item.id);
                // let actionData =
                //     new ActionRecord({
                //         id: shortid.generate(),
                //         cardId: item.id,
                //         actionType: 'SET_CARD_INDEX',
                //         data: { index }
                //     });
                TerminalManager.executeAction('', item.id, item.id, 'SET_CARD_INDEX', { index })
                    .then(() => TerminalManager.closeCard('', item.id));
                // this.props.postCommit(item, IList<ActionRecord>([actionData]));
            }
        }
    }

    private getTabValues(currentCardType: CardTypeRecord): string[] {
        let result: string[] = [];
        if (currentCardType.tagTypes.length < 0) { return result; }
        result = currentCardType.tagTypes
            .reduce(
                (r, tagTypeId) => {
                    const tt = ConfigManager.getTagTypeById(tagTypeId);
                    if (tt && tt.cardTypeReferenceName) {
                        const ct = ConfigManager.getCardTypeByRef(tt.cardTypeReferenceName);
                        if (ct) { r.push(ct.name); }
                    }
                    return r;
                },
                result);
        result.unshift(currentCardType.name);
        return result;
    }

    private handleCardSelection(selectedCard: CardRecord, cardType: CardTypeRecord, cards: CardRecord[]) {
        if (cards.length === 1) {
            this.displayCard(cards[0]);
        } else if (cards.length === 0) {
            const tt = this.props.currentCardType.tagTypes.find(tagTypeId => {
                const type = ConfigManager.getTagTypeById(tagTypeId);
                return type !== undefined && type.cardTypeReferenceName === cardType.reference;
            });
            const tag = {
                typeId: tt,
                name: cardType.reference,
                value: selectedCard.name
            };
            this.addNewCard([new CardTagRecord(tag)]);
        } else if (cards.length > 1) {
            this.props.SetModalComponent(<>
                <DialogTitle>Select {this.state.currentCardType.reference}</DialogTitle>
                <Divider />
                <CardSelector
                    sourceCards={List<CardRecord>(cards)}
                    sourceCardType={this.props.currentCardType}
                    onSelectCard={c => this.displayCard(c)}
                />
                <DialogActions>
                    <Button onClick={() => this.props.SetModalState(false)}>Cancel</Button>
                </DialogActions>
            </>);
        }
    }

    private getSecondaryCommands() {
        const result = [
            {
                icon: 'arrow_drop_down',
                menuItems: this.props.rootCardTypes.map(ct => {
                    return {
                        icon: ct, onClick: () => {
                            const item = this.props.cardTypes.valueSeq().find(c => c.name === ct);
                            if (item) { this.setState({ currentCardType: item }); }
                            this.props.setCurrentCardType(item);
                        }
                    };
                })
            },
            {
                icon: 'developer_mode',
                menuItems: [
                    {
                        icon: 'Show Hidden Cards',
                        onClick: () => {
                            this.props.setShowAllCards(!this.props.showAllCards);
                        }
                    },
                    {
                        icon: 'Create 500 Test Cards',
                        onClick: () => {
                            if (this.props.currentCardType.name === 'Customers') {
                                this.props.createFakeCustomers();
                            } else if (this.props.currentCardType.name === 'Products') {
                                this.props.createFakeProducts();
                            } else {
                                alert('This function can be used for `Customers` or `Products`');
                            }
                        }
                    },
                    {
                        icon: 'Delete Cards',
                        onClick: () => {
                            this.props.deleteCards(this.props.currentCardType.id);
                        }
                    }
                ]
            },
            {
                icon: 'add',
                onClick: () => this.addNewCard([])
            }
        ];
        return result;
    }
}

const mapStateToProps = (state: IApplicationState) => ({
    cards: state.cards.cards,
    card: state.cards.currentCard,
    cardTypes: state.config.cardTypes,
    rootCardTypes: state.config.rootCardTypes,
    currentCardType: state.cards.currentCardType,
    cardListScrollTop: state.cards.cardListScrollTop,
    searchValue: state.cards.searchValue,
    showAllCards: state.cards.showAllCards,
    tabIndex: state.cards.tabIndex
});

export default decorate(connect(
    mapStateToProps,
    Extender.extend(ClientStore.actionCreators, CardStore.actionCreators)
)(CardsPage));