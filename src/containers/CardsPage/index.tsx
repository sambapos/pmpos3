import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import * as shortid from 'shortid';
import * as CardStore from '../../store/Cards';
import * as ClientStore from '../../store/Client';
import * as Extender from '../../lib/Extender';
import { RouteComponentProps } from 'react-router';
import {
    WithStyles, Paper, Button,
    AppBar, Tab, Tabs, DialogTitle, Divider, DialogActions
} from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import { Map as IMap, List as IList } from 'immutable';
import TopBar from '../TopBar';
import * as h from './helpers';
import DraggableCardList from '../../components/DraggableCardList';
import CardSelector from '../../components/CardSelector';
import { CardRecord, CardTypeRecord, CardTag, CardTagRecord, ActionRecord } from 'pmpos-models';
import { CardList } from 'pmpos-modules';

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
    & WithStyles<keyof Style>
    & typeof CardStore.actionCreators
    & typeof ClientStore.actionCreators
    & RouteComponentProps<{}>;

interface State {
    currentCardType: CardTypeRecord;
    itemCount: number;
    searchValueText: string;
    tabs: string[];
}

class CardsPage extends React.Component<PageProps, State> {
    constructor(props: PageProps) {
        super(props);
        let filteredItems = h.getFilteredItems(props.cards, props.searchValue, props.showAllCards);
        this.state = {
            currentCardType: props.currentCardType,
            itemCount: filteredItems.count(),
            searchValueText: props.searchValue,
            tabs: this.getTabValues(props.currentCardType),
        };
    }

    componentWillReceiveProps(nextProps: PageProps) {
        if (nextProps.currentCardType.name !== this.state.currentCardType.name) {
            this.setState({
                currentCardType: nextProps.currentCardType,
                tabs: this.getTabValues(nextProps.currentCardType),
            });
        }
        if (nextProps.cards !== this.props.cards
            || nextProps.searchValue !== this.props.searchValue
            || nextProps.showAllCards !== this.props.showAllCards) {
            let filteredItems = h.getFilteredItems(nextProps.cards, nextProps.searchValue, nextProps.showAllCards);
            this.setState({
                searchValueText: nextProps.searchValue,
                itemCount: filteredItems.count(),
            });
        }
    }

    handleChangeListIndex = index => {
        this.props.setTabIndex(index);
    }

    updateSearch() {
        this.props.setSearchValue(this.state.searchValueText);
    }

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

    onSaveSortOrder = (list: CardRecord[]) => {
        for (let index = 0; index < list.length; index++) {
            const item = list[index];
            if (item.index !== index) {
                list[index] = item.set('index', index);
                let actionData =
                    new ActionRecord({
                        id: shortid.generate(),
                        cardId: item.id,
                        actionType: 'SET_CARD_INDEX',
                        data: { index }
                    });
                this.props.postCommit(item, IList<ActionRecord>([actionData]));
            }
        }
    }

    private getTabValues(currentCardType: CardTypeRecord): string[] {
        let result: string[] = [];
        if (currentCardType.tagTypes.length < 0) { return result; }
        result = currentCardType.tagTypes
            .reduce(
                (r, t) => {
                    let tt = CardList.tagTypes.get(t);
                    if (tt && tt.cardTypeReferenceName) {
                        let ct = CardList.getCardTypeByRef(tt.cardTypeReferenceName);
                        if (ct) { r.push(ct.name); }
                    }
                    return r;
                },
                result);
        result.unshift(currentCardType.name);
        return result;
    }

    handleCardSelection(selectedCard: CardRecord, cardType: CardTypeRecord, cards: CardRecord[]) {
        if (cards.length === 1) {
            this.displayCard(cards[0]);
        } else if (cards.length === 0) {
            let tt = this.props.currentCardType.tagTypes.find(t => {
                let type = CardList.tagTypes.get(t);
                return type !== undefined && type.cardTypeReferenceName === cardType.reference;
            });
            let tag = {
                typeId: tt,
                name: cardType.reference,
                value: selectedCard.name
            };
            this.addNewCard([new CardTagRecord(tag)]);
        } else if (cards.length > 1) {
            let groupedMap = IMap<string, any[]>(_.groupBy(cards, x => x.category));
            this.props.SetModalComponent(<>
                <DialogTitle>Select {this.state.currentCardType.reference}</DialogTitle>
                <Divider />
                <DraggableCardList
                    items={groupedMap}
                    onDragEnd={r => false}
                    template={this.state.currentCardType ? this.state.currentCardType.displayFormat : ''}
                    onClick={c => this.displayCard(c)}
                />
                <DialogActions>
                    <Button onClick={() => this.props.SetModalState(false)}>Cancel</Button>
                </DialogActions>
            </>);
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

    getSecondaryCommands() {
        let result = [
            {
                icon: 'arrow_drop_down',
                menuItems: this.props.rootCardTypes.map(ct => {
                    return {
                        icon: ct, onClick: () => {
                            let item = this.props.cardTypes.valueSeq().find(c => c.name === ct);
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
                                h.createTestCards(this.props);
                            } else {
                                alert('This function can be used for `Customers`');
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

const mapStateToProps = (state: ApplicationState) => ({
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