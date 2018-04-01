import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import * as CardStore from '../../store/Cards';
import { RouteComponentProps } from 'react-router';
import { CellMeasurerCache } from 'react-virtualized';
import { WithStyles, Paper } from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import { Map as IMap, List as IList } from 'immutable';
import TopBar from '../TopBar';
import { CardRecord } from '../../models/Card';
import { CardTypeRecord } from '../../models/CardType';
import TextField from 'material-ui/TextField/TextField';
import * as h from './helpers';
import VirtualCardList from './VirtualCardList';
import DraggableCardList from './DraggableCardList';

type PageProps =
    {
        cards: IList<CardRecord>,
        card: CardRecord,
        cardTypes: IMap<string, CardTypeRecord>,
        currentCardType: CardTypeRecord,
        cardListScrollTop: number,
        searchValue: string,
        showAllCards: boolean
    }
    & WithStyles<keyof Style>
    & typeof CardStore.actionCreators
    & RouteComponentProps<{}>;

interface State {
    currentCardType: CardTypeRecord;
    items: any[];
    itemCount: number;
    scrollTop: number;
    searchValueText: string;
}

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

class CardsPage extends React.Component<PageProps, State> {

    private debouncedSearch;
    private debouncedHandleScroll;
    private itemCount = 50;

    public cache = new CellMeasurerCache({
        defaultWidth: 100,
        defaultHeight: 999999,
        fixedWidth: true
    });

    constructor(props: PageProps) {
        super(props);
        let filteredItems = h.getFilteredItems(props.cards, props.searchValue, props.showAllCards);
        this.state = {
            currentCardType: props.currentCardType,
            items: h.getItems(filteredItems, 0, this.itemCount),
            itemCount: filteredItems.count(),
            scrollTop: props.cardListScrollTop,
            searchValueText: props.searchValue
        };
    }

    componentWillMount() {
        this.debouncedHandleScroll = _.debounce(this.handle_scroll, 100);
        this.debouncedSearch = _.debounce(this.updateSearch, 200);
    }

    componentWillReceiveProps(nextProps: PageProps) {
        if (nextProps.currentCardType.name !== this.state.currentCardType.name) {
            this.setState({
                currentCardType: nextProps.currentCardType
            });
            this.cache.clearAll();
        }
        let filteredItems = h.getFilteredItems(nextProps.cards, nextProps.searchValue, nextProps.showAllCards);
        this.setState({
            searchValueText: nextProps.searchValue,
            items: h.getItems(filteredItems, 0, this.itemCount),
            itemCount: filteredItems.count(),
            scrollTop: 0
        });
    }

    handle_scroll(scrollTop: number) {
        this.setState({ scrollTop });
    }

    updateSearch() {
        this.props.setSearchValue(this.state.searchValueText);
    }

    private isRowLoaded({ index }: any) {
        return !!this.state.items[index];
    }

    private loadMoreRows({ startIndex, stopIndex }: any) {
        let filteredItems = h.getFilteredItems(this.props.cards, this.props.searchValue, this.props.showAllCards);
        let items = this.state.items.concat(h.getItems(filteredItems, startIndex, stopIndex - startIndex + 1));
        this.setState({ items, itemCount: filteredItems.count() });
    }

    private renderCardList() {

        if (!this.props.searchValue && this.state.itemCount < this.itemCount * 2) {
            return <DraggableCardList
                items={this.state.items}
                onDragEnd={r => this.onDragEnd(r)}
                template={this.state.currentCardType ? this.state.currentCardType.displayFormat : ''}
                onClick={c => {
                    this.props.setCardListScrollTop(this.state.scrollTop);
                    this.props.history.push(
                        process.env.PUBLIC_URL + '/card/' + c.id);
                }}
            />;
        }

        return <VirtualCardList
            rowCount={this.state.itemCount}
            scrollTop={this.state.scrollTop}
            cache={this.cache}
            isRowLoaded={x => this.isRowLoaded(x)}
            loadMoreRows={x => this.loadMoreRows(x)}
            onClick={c => {
                this.props.setCardListScrollTop(this.state.scrollTop);
                this.props.history.push(
                    process.env.PUBLIC_URL + '/card/' + c.id);
            }}
            debouncedHandleScroll={x => this.debouncedHandleScroll(x)}
            items={this.state.items}
            template={this.state.currentCardType ? this.state.currentCardType.displayFormat : ''}
        />;
    }

    public render() {
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title={this.state.currentCardType ? this.state.currentCardType.name : 'Cards'}
                    secondaryCommands={this.getSecondaryCommands()}
                />
                <TextField
                    className={this.props.classes.search}
                    label="Search"
                    value={this.state.searchValueText}
                    onChange={e => {
                        this.setState({ searchValueText: e.target.value });
                        this.debouncedSearch();
                    }}
                />
                <Paper className={this.props.classes.content}>
                    {this.renderCardList()}
                </Paper>
            </div>
        );
    }

    getSecondaryCommands() {
        let result = [
            {
                icon: 'arrow_drop_down',
                menuItems: this.props.cardTypes.valueSeq().map(ct => {
                    return {
                        icon: ct.name, onClick: () => {
                            let item = this.props.cardTypes.valueSeq().find(c => c.name === ct.name);
                            if (item) { this.setState({ currentCardType: item }); }
                            this.props.setCurrentCardType(item);
                        }
                    };
                }).toArray()
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
                onClick: () => {
                    if (this.props.currentCardType.id) {
                        this.props.addCard(this.props.currentCardType);
                        this.props.history.push(process.env.PUBLIC_URL + '/card');
                    }
                }
            }
        ];
        return result;
    }

    onDragEnd(result: any) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        );

        this.setState({
            items,
        });
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    cards: state.cards.cards,
    card: state.cards.currentCard,
    cardTypes: state.config.cardTypes,
    currentCardType: state.cards.currentCardType,
    cardListScrollTop: state.cards.cardListScrollTop,
    searchValue: state.cards.searchValue,
    showAllCards: state.cards.showAllCards
});

export default decorate(connect(
    mapStateToProps,
    CardStore.actionCreators
)(CardsPage));