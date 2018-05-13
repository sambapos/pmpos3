import * as React from 'react';
import * as _ from 'lodash';
import { List } from 'immutable';
import { CellMeasurerCache } from 'react-virtualized';
import VirtualList from '../VirtualList';
import DraggableList from '../DraggableList';
import { CardRecord, CardTypeRecord } from 'pmpos-models';

interface ICardListProps {
    cards: List<CardRecord>;
    cardType: CardTypeRecord;
    cardListScrollTop: number;
    onClick: (c: any) => void;
    onScrollChange: (sp: number) => void;
    onSaveSortOrder: (items: CardRecord[]) => void;
}

interface ICardListState {
    scrollTop: number;
    items: any[];
}

export default class extends React.Component<ICardListProps, ICardListState> {

    private debouncedHandleScroll;
    private itemCount = 100;

    private cache = new CellMeasurerCache({
        defaultWidth: 100,
        defaultHeight: 999999,
        fixedWidth: true
    });

    constructor(props: ICardListProps) {
        super(props);
        this.state = {
            items: this.getItems(props.cards, 0, this.itemCount),
            scrollTop: props.cardListScrollTop,
        };
    }

    public componentWillMount() {
        this.debouncedHandleScroll = _.debounce(this.handle_scroll, 100);
    }

    public componentWillReceiveProps(nextProps: ICardListProps) {
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

    public render() {
        return this.getCardList();
    }

    private handle_scroll(scrollTop: number) {
        this.setState({ scrollTop });
    }

    private isRowLoaded({ index }: any) {
        return !!this.state.items[index];
    }

    private loadMoreRows({ startIndex, stopIndex }: any) {
        const items = this.state.items.concat(this.getItems(this.props.cards, startIndex, stopIndex - startIndex + 1));
        this.setState({ items });
    }

    private getItems(cards: List<CardRecord>, startIndex: number, itemCount: number) {
        const result = cards
            .skip(startIndex)
            .take(itemCount)
            .sort((x, y) => x.index - y.index)
            .toArray();
        return result;
    }

    private handleOnClick(c: any) {
        this.props.onScrollChange(this.state.scrollTop);
        this.props.onClick(c);
    }

    private getCardList() {
        if (this.props.cards.count() <= this.itemCount) {
            return <DraggableList
                items={this.state.items}
                template={this.props.cardType ? this.props.cardType.displayFormat : ''}
                onClick={c => this.handleOnClick(c)}
                onSaveSortOrder={this.props.onSaveSortOrder}
            />;
        }

        return <VirtualList
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
}