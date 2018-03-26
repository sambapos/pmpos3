import * as React from 'react';
import { connect } from 'react-redux';
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
import * as faker from 'faker';
import CardItem from './CardItem';

type PageProps =
    {
        cards: IList<CardRecord>,
        card: CardRecord,
        cardTypes: IMap<string, CardTypeRecord>,
        currentCardType: CardTypeRecord
    }
    & WithStyles<keyof Style>
    & typeof CardStore.actionCreators
    & RouteComponentProps<{}>;

interface State {
    currentCardType: CardTypeRecord;
    showClosedCards: boolean;
    searchValue: string;
    items: any[];
}

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : ''
});

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    background: isDragging ? 'white' : '',
    // styles we need to apply on draggables
    ...draggableStyle,
});

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

class CardsPage extends React.Component<PageProps, State> {

    private itemCount = 100;
    private itemThresold = 50;

    public cache = new CellMeasurerCache({
        defaultWidth: 100,
        defaultHeight: 999999,
        fixedWidth: true
    });

    constructor(props: PageProps) {
        super(props);
        this.state = {
            currentCardType: props.currentCardType,
            showClosedCards: false,
            searchValue: '',
            items: this.getItems(props.cards, '', false, 0, this.itemCount)
        };
    }

    componentWillReceiveProps(nextProps: PageProps) {
        if (nextProps.currentCardType.name !== this.state.currentCardType.name) {
            this.setState({
                currentCardType: nextProps.currentCardType
            });
        }
        this.setState({
            items: this.getItems(nextProps.cards, this.state.searchValue, this.state.showClosedCards, 0, this.itemCount)
        });
        this.cache.clearAll();
    }

    createTestCards() {
        for (let index = 0; index < 500; index++) {
            this.props.addCard(this.props.currentCardType);
            this.props.addPendingAction(undefined, 'SET_CARD_TAG', {
                name: 'Name', value: faker.name.findName()
            });
            this.props.addPendingAction(undefined, 'SET_CARD_TAG', {
                name: 'Address', value: faker.address.streetAddress()
            });
            this.props.addPendingAction(undefined, 'SET_CARD_TAG', {
                name: 'Phone', value: faker.phone.phoneNumber()
            });
            this.props.commitCard();
        }
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
                            this.setState({ showClosedCards: !this.state.showClosedCards });
                        }
                    },
                    {
                        icon: 'Create Test Cards',
                        onClick: () => {
                            this.createTestCards();
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

    public getItems(
        cards: IList<CardRecord>,
        searchValue: string,
        showClosedCards: boolean,
        startIndex: number,
        itemCount: number) {
        let result = cards
            .filter(x =>
                searchValue
                || showClosedCards
                || !x.isClosed)
            .filter(x => !searchValue
                || Boolean(x.tags.find(t => t.value.toLowerCase().includes(this.state.searchValue.toLowerCase()))))
            .skip(startIndex)
            .take(itemCount)
            .sort((x, y) => x.index - y.index)
            .map(card => {
                return {
                    text: card.display,
                    id: card.id,
                    secondary: card.tags.valueSeq()
                        .filter(tag => tag.name !== 'Name')
                        .map(tag => (
                            <span
                                style={{ marginRight: '8px' }}
                                key={tag.name}
                            >
                                {tag.display}
                            </span>)),
                    action: card.balanceDisplay
                };
            })
            .toArray();
        return result;
    }

    private isRowLoaded({ index }: any) {
        return !!this.state.items[index];
    }

    private loadMoreRows({ startIndex, stopIndex }: any) {
        let items = this.state.items.concat(this.getItems(
            this.props.cards, this.state.searchValue, this.state.showClosedCards,
            startIndex, stopIndex - startIndex + 1));
        this.setState({ items });
        this.cache.clearAll();
    }

    private renderCardList() {
        var rowCount = this.props.cards.count();

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
                        <DragDropContext onDragEnd={(r) => this.onDragEnd(r)}>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}
                                    >
                                        <List
                                            onRowsRendered={onRowsRendered}
                                            deferredMeasurementCache={this.cache}
                                            ref={registerChild}
                                            rowCount={rowCount}
                                            rowHeight={this.cache.rowHeight}
                                            width={width}
                                            height={height}
                                            // scrollTop={this.props.scrollTop}
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
                                    style={getItemStyle(
                                        snapshot1.isDragging,
                                        provided1.draggableProps.style
                                    )}
                                >
                                    <CardItem card={card} onClick={c => this.props.history.push(
                                        process.env.PUBLIC_URL + '/card/' + c.id)} />

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
                    secondaryCommands={this.getSecondaryCommands()}
                />
                <TextField
                    className={this.props.classes.search}
                    label="Search"
                    value={this.state.searchValue}
                    onChange={e => this.setState({ searchValue: e.target.value })}
                />
                <Paper className={this.props.classes.content}>
                    {this.renderCardList()}
                    {/* <DragDropContext onDragEnd={(r) => this.onDragEnd(r)}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                >
                                    <List>
                                        {this.state.items.map((c, index) => {
                                            return (
                                                <Draggable key={c.id} draggableId={c.id} index={index}>
                                                    {(provided1, snapshot1) => (
                                                        <div>
                                                            <div
                                                                ref={provided1.innerRef}
                                                                {...provided1.draggableProps}
                                                                {...provided1.dragHandleProps}
                                                                style={getItemStyle(
                                                                    snapshot1.isDragging,
                                                                    provided1.draggableProps.style
                                                                )}
                                                            >
                                                                <ListItem button divider
                                                                    key={c.id}
                                                                    onClick={
                                                                        () => this.props.history.push(
                                                                            process.env.PUBLIC_URL + '/card/' + c.id)
                                                                    }>
                                                                    <ListItemText
                                                                        primary={c.text}
                                                                        secondary={c.secondary}
                                                                    />
                                                                    <ListItemSecondaryAction
                                                                        style={{ right: 10, fontSize: '1.1 em' }}>
                                                                        {c.action}
                                                                    </ListItemSecondaryAction>
                                                                </ListItem>
                                                            </div>
                                                            {provided1.placeholder}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                    </List>
                                    {provided.placeholder}
                                </div>
                            )}

                        </Droppable>
                    </DragDropContext> */}
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
    currentCardType: state.cards.currentCardType
});

export default decorate(connect(
    mapStateToProps,
    CardStore.actionCreators
)(CardsPage));