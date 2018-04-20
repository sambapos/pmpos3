import * as React from 'react';
import { CellMeasurerCache } from 'react-virtualized';
import VirtualCardList from './VirtualCardList';
import * as _ from 'lodash';
import { List } from 'immutable';
import { CardRecord, CardTypeRecord } from 'pmpos-models';

interface CardListProps {
    cards: List<CardRecord>;
    searchValue: string;
    showAllCards: boolean;
    cardType: CardTypeRecord;
    onClick: (c: any) => void;
}

interface CardListState {
    itemCount: number;
    scrollTop: number;
    items: any[];
}

export default class extends React.Component<CardListProps, CardListState> {

    private debouncedHandleScroll;
    private itemCount = 50;

    cache = new CellMeasurerCache({
        defaultWidth: 100,
        defaultHeight: 999999,
        fixedWidth: true
    });

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

    render() {
        return <VirtualCardList
            rowCount={this.state.itemCount}
            scrollTop={this.state.scrollTop}
            cache={this.cache}
            isRowLoaded={x => this.isRowLoaded(x)}
            loadMoreRows={x => this.loadMoreRows(x)}
            onClick={c => this.props.onClick(c)}
            debouncedHandleScroll={x => this.debouncedHandleScroll(x)}
            items={this.state.items}
            template={this.props.cardType ? this.props.cardType.displayFormat : ''}
        />;
    }
}