import * as React from 'react';
import {
    Snackbar, Button, IconButton, Icon
} from 'material-ui';
import { CellMeasurerCache } from 'react-virtualized';
import VirtualCardList from '../../components/VirtualCardList';
import { reorder } from '../../lib/helpers';
import * as _ from 'lodash';
import { List, Map as IMap } from 'immutable';
import DraggableCardList from '../../components/DraggableCardList';
import { CardRecord, CardTypeRecord } from 'pmpos-models';

interface CardListProps {
    cards: List<CardRecord>;
    searchValue: string;
    showAllCards: boolean;
    cardType: CardTypeRecord;
    cardListScrollTop: number;
    onClick: (c: any) => void;
    onScrollChange: (sp: number) => void;
    onSaveSortOrder: (items: any[]) => void;
}

interface CardListState {
    itemCount: number;
    scrollTop: number;
    items: any[];
    snackbarOpen: boolean;
}

export default class extends React.Component<CardListProps, CardListState> {

    private debouncedHandleScroll;
    private itemCount = 50;

    cache = new CellMeasurerCache({
        defaultWidth: 100,
        defaultHeight: 999999,
        fixedWidth: true
    });

    constructor(props: CardListProps) {
        super(props);
        let filteredItems = this.getFilteredItems(props.cards, props.searchValue, props.showAllCards);
        this.state = {
            items: this.getItems(filteredItems, 0, this.itemCount),
            itemCount: filteredItems.count(),
            scrollTop: props.cardListScrollTop,
            snackbarOpen: false
        };
    }

    handleSnackbarClose = (event, reason?) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ snackbarOpen: false });
    }

    componentWillMount() {
        this.debouncedHandleScroll = _.debounce(this.handle_scroll, 100);
    }

    componentWillReceiveProps(nextProps: CardListProps) {
        if (nextProps.cardType.name !== this.props.cardType.name) {
            this.cache.clearAll();
        }
        if (this.props.searchValue !== nextProps.searchValue
            || nextProps.cardType.name !== this.props.cardType.name) {
            this.setState({ scrollTop: 0 });
        }
        if (this.state.items.length === 0
            || nextProps.cards !== this.props.cards
            || nextProps.searchValue !== this.props.searchValue
            || nextProps.showAllCards !== this.props.showAllCards) {
            let filteredItems = this.getFilteredItems(nextProps.cards, nextProps.searchValue, nextProps.showAllCards);
            this.setState({
                items: this.getItems(filteredItems, 0, this.itemCount),
                itemCount: filteredItems.count(),
            });
        }
    }

    handle_scroll(scrollTop: number) {
        this.setState({ scrollTop });
    }

    private isRowLoaded({ index }: any) {
        return !!this.state.items[index];
    }

    private loadMoreRows({ startIndex, stopIndex }: any) {
        let filteredItems = this.getFilteredItems(this.props.cards, this.props.searchValue, this.props.showAllCards);
        let items = this.state.items.concat(this.getItems(filteredItems, startIndex, stopIndex - startIndex + 1));
        this.setState({ items, itemCount: filteredItems.count() });
    }

    getFilteredItems(items: List<CardRecord>, searchValue: string, showClosedCards: boolean) {
        return items.filter(x =>
            searchValue
            || showClosedCards
            || !x.isClosed)
            .filter(x => !searchValue
                || Boolean(x.tags.find(t => t.value.toLowerCase().includes(searchValue.toLowerCase()))));
    }

    getItems(cards: List<CardRecord>, startIndex: number, itemCount: number) {
        let result = cards
            .skip(startIndex)
            .take(itemCount)
            .sort((x, y) => x.index - y.index)
            .toArray();
        return result;
    }

    onDragEnd(result: any) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        if (result.source.index === result.destination.index) { return; }

        let items = reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        );

        this.setState({
            items,
            snackbarOpen: true
        });
    }

    handleOnClick(c: any) {
        this.props.onScrollChange(this.state.scrollTop);
        this.props.onClick(c);
    }

    getCardList() {
        if (!this.props.searchValue && this.state.itemCount < this.itemCount * 2) {
            let groupedMap = IMap<string, any[]>(_.groupBy(this.state.items, x => x.category));
            return <DraggableCardList
                items={groupedMap}
                onDragEnd={r => this.onDragEnd(r)}
                template={this.props.cardType ? this.props.cardType.displayFormat : ''}
                onClick={c => this.handleOnClick(c)}
            />;
        }

        return <VirtualCardList
            rowCount={this.state.itemCount}
            scrollTop={this.state.scrollTop}
            cache={this.cache}
            isRowLoaded={x => this.isRowLoaded(x)}
            loadMoreRows={x => this.loadMoreRows(x)}
            onClick={c => this.handleOnClick(c)}
            debouncedHandleScroll={x => this.debouncedHandleScroll(x)}
            items={this.state.items}
            template={this.props.cardType ? this.props.cardType.displayFormat : ''}
        />;
    }

    render() {
        return <>
            {this.getCardList()}
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={this.state.snackbarOpen}
                onClose={this.handleSnackbarClose}
                SnackbarContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">Sort Order changed</span>}
                action={[
                    <Button key="save" color="secondary" size="small"
                        onClick={e => {
                            this.props.onSaveSortOrder(this.state.items);
                            this.handleSnackbarClose(e);
                        }}>
                        Save
                        </Button>,
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={this.handleSnackbarClose}
                    >
                        <Icon>close</Icon>
                    </IconButton>,
                ]}
            />
        </>;
    }
}