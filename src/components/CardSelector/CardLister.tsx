import * as React from 'react';
import * as _ from 'lodash';
import { List } from 'immutable';
import { CellMeasurerCache } from 'react-virtualized';
import VirtualCardList from './VirtualCardList';
import DraggableCardList from './DraggableCardList';
import { CardRecord, CardTypeRecord } from 'pmpos-models';

interface CardListProps {
    cards: List<CardRecord>;
    cardType: CardTypeRecord;
    cardListScrollTop: number;
    onClick: (c: any) => void;
    onScrollChange: (sp: number) => void;
    onSaveSortOrder: (items: CardRecord[]) => void;
}

interface CardListState {
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

    constructor(props: CardListProps) {
        super(props);
        this.state = {
            items: this.getItems(props.cards, 0, this.itemCount),
            scrollTop: props.cardListScrollTop,
        };
    }

    componentWillMount() {
        this.debouncedHandleScroll = _.debounce(this.handle_scroll, 100);
    }

    componentWillReceiveProps(nextProps: CardListProps) {
        if (nextProps.cardType.name !== this.props.cardType.name) {
            this.cache.clearAll();
            this.setState({ scrollTop: 0 });
        }
        if (this.state.items.length === 0
            || nextProps.cards !== this.props.cards) {
            this.setState({
                items: this.getItems(nextProps.cards, 0, this.itemCount),
                scrollTop: 0
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
        let items = this.state.items.concat(this.getItems(this.props.cards, startIndex, stopIndex - startIndex + 1));
        this.setState({ items });
    }

    getItems(cards: List<CardRecord>, startIndex: number, itemCount: number) {
        let result = cards
            .skip(startIndex)
            .take(itemCount)
            .sort((x, y) => x.index - y.index)
            .toArray();
        return result;
    }

    handleOnClick(c: any) {
        this.props.onScrollChange(this.state.scrollTop);
        this.props.onClick(c);
    }

    getCardList() {
        if (this.props.cards.count() < this.itemCount * 2) {
            return <DraggableCardList
                items={this.state.items}
                template={this.props.cardType ? this.props.cardType.displayFormat : ''}
                onClick={c => this.handleOnClick(c)}
                onSaveSortOrder={this.props.onSaveSortOrder}
            />;
        }

        return <VirtualCardList
            rowCount={this.props.cards.count()}
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
        return this.getCardList();
    }
}