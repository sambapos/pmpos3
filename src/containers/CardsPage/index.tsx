import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import * as CardStore from '../../store/Cards';
import { RouteComponentProps } from 'react-router';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { InfiniteLoader, List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { WithStyles, Paper } from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import { Map as IMap, List as IList } from 'immutable';
import TopBar from '../TopBar';
import { CardRecord } from '../../models/Card';
import { CardTypeRecord } from '../../models/CardType';
import TextField from 'material-ui/TextField/TextField';
import CardItem from './CardItem';
import * as h from './helpers';

type PageProps =
    {
        cards: IList<CardRecord>,
        card: CardRecord,
        cardTypes: IMap<string, CardTypeRecord>,
        currentCardType: CardTypeRecord,
        cardListScrollTop: number
    }
    & WithStyles<keyof Style>
    & typeof CardStore.actionCreators
    & RouteComponentProps<{}>;

interface State {
    currentCardType: CardTypeRecord;
    showClosedCards: boolean;
    searchValue: string;
    items: any[];
    itemCount: number;
    scrollTop: number;
}
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

class CardsPage extends React.Component<PageProps, State> {

    private debouncedHandleScroll;
    private itemCount = 50;
    private itemThresold = 25;

    public cache = new CellMeasurerCache({
        defaultWidth: 100,
        defaultHeight: 999999,
        fixedWidth: true
    });

    constructor(props: PageProps) {
        super(props);
        let filteredItems = h.getFilteredItems(props.cards, '', false);
        this.state = {
            currentCardType: props.currentCardType,
            showClosedCards: false,
            searchValue: '',
            items: h.getItems(filteredItems, 0, this.itemCount),
            itemCount: filteredItems.count(),
            scrollTop: props.cardListScrollTop,
        };
    }

    componentWillMount() {
        this.debouncedHandleScroll = _.debounce(this.handle_scroll, 400);
    }

    componentWillReceiveProps(nextProps: PageProps) {
        if (nextProps.currentCardType.name !== this.state.currentCardType.name) {
            this.setState({
                currentCardType: nextProps.currentCardType
            });
        }
        let filteredItems = h.getFilteredItems(nextProps.cards, this.state.searchValue, this.state.showClosedCards);
        this.setState({
            items: h.getItems(filteredItems, 0, this.itemCount),
            itemCount: filteredItems.count(),
            scrollTop: 0,
        });
        this.cache.clearAll();
    }

    handle_scroll(scrollTop: number) {
        this.setState({ scrollTop });
    }

    private isRowLoaded({ index }: any) {
        return !!this.state.items[index];
    }

    private loadMoreRows({ startIndex, stopIndex }: any) {
        let filteredItems = h.getFilteredItems(this.props.cards, this.state.searchValue, this.state.showClosedCards);
        let items = this.state.items.concat(h.getItems(filteredItems, startIndex, stopIndex - startIndex + 1));
        this.setState({ items, itemCount: filteredItems.count() });
        this.cache.clearAll();
    }

    private renderCardList() {
        var rowCount = this.state.itemCount;

        return <InfiniteLoader
            isRowLoaded={(x) => this.isRowLoaded(x)}
            loadMoreRows={(x) => this.loadMoreRows(x)}
            rowCount={rowCount}
            minimumBatchSize={this.itemCount}
            threshold={this.itemThresold}
        >
            {({ onRowsRendered, registerChild }) => (
                <AutoSizer onResize={() => {
                    this.cache.clearAll();
                }}>
                    {({ height, width }) => (
                        <DragDropContext onDragEnd={r => this.onDragEnd(r)}>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={h.getListStyle(snapshot.isDraggingOver)}
                                    >
                                        <List
                                            onRowsRendered={onRowsRendered}
                                            deferredMeasurementCache={this.cache}
                                            ref={registerChild}
                                            rowCount={rowCount}
                                            rowHeight={this.cache.rowHeight}
                                            width={width}
                                            height={height}
                                            scrollTop={this.state.scrollTop}
                                            onScroll={(x) => this.debouncedHandleScroll(x.scrollTop)}
                                            rowRenderer={(x) => this.cardRenderer(x)}
                                        />
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                </AutoSizer>
            )}
        </InfiniteLoader>;
    }

    private cardRenderer({ key, index, style, parent }: any) {
        if (index >= this.state.items.length) { return 'NA'; }
        var card = this.state.items[index];
        return (<CellMeasurer
            cache={this.cache}
            columnIndex={0}
            key={key}
            parent={parent}
            rowIndex={index}
        >
            {({ measure }) => {
                return (
                    <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided1, snapshot1) => (
                            <div style={style}>
                                <div
                                    ref={provided1.innerRef}
                                    {...provided1.draggableProps}
                                    {...provided1.dragHandleProps}
                                    style={h.getItemStyle(
                                        snapshot1.isDragging,
                                        provided1.draggableProps.style
                                    )}
                                >
                                    <CardItem
                                        card={card}
                                        onClick={c => {
                                            this.props.setCardListScrollTop(this.state.scrollTop);
                                            this.props.history.push(
                                                process.env.PUBLIC_URL + '/card/' + c.id);
                                        }} />

                                </div>
                                {provided1.placeholder}
                            </div>
                        )}
                    </Draggable>
                );
            }}
        </CellMeasurer>
        );
    }

    public render() {
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title={this.state.currentCardType ? this.state.currentCardType.name : 'Cards'}
                    secondaryCommands={h.getSecondaryCommands(this)}
                />
                <TextField
                    className={this.props.classes.search}
                    label="Search"
                    value={this.state.searchValue}
                    onChange={e => this.setState({ searchValue: e.target.value })}
                />
                <Paper className={this.props.classes.content}>
                    {this.renderCardList()}
                </Paper>
            </div>
        );
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
    cardListScrollTop: state.cards.cardListScrollTop
});

export default decorate(connect(
    mapStateToProps,
    CardStore.actionCreators
)(CardsPage));