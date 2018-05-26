import * as React from 'react';
import { InfiniteLoader, List, AutoSizer, CellMeasurer } from 'react-virtualized';
import CardItem from './CardItem';

const itemCount = 50;
const itemThresold = 25;

const rowRenderer = (
    { key, index, style, parent }: any,
    items: any[],
    cache: any,
    onClick: (c: any) => void,
    template: string
) => {

    if (index >= items.length) { return 'NA'; }
    const card = items[index];
    return (<CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
    >
        <CardItem
            template={template}
            style={style}
            card={card}
            onUpdate={(c) => {
                if (index < items.length) { cache.clear(index, 0); }
            }}
            onClick={c => onClick(c)} />
    </CellMeasurer>
    );
};

interface IVirtualListProps {
    rowCount: number;
    scrollTop: number;
    cache: any;
    isRowLoaded: (x: any) => boolean;
    loadMoreRows: (x: any) => Promise<any>;
    onClick: (c: any) => void;
    debouncedHandleScroll: (x: number) => void;
    items: any[];
    template: string;
}

export default class VirtualList extends React.Component<IVirtualListProps> {
    private list: any;

    public componentDidMount() {
        if (this.list) { this.list.scrollToPosition(this.props.scrollTop); }
    }

    public render() {
        return <InfiniteLoader
            isRowLoaded={(x) => this.props.isRowLoaded(x)}
            loadMoreRows={(x) => this.props.loadMoreRows(x)}
            rowCount={this.props.rowCount}
            minimumBatchSize={itemCount}
            threshold={itemThresold}
        >
            {({ onRowsRendered, registerChild }) => (
                <AutoSizer onResize={() => {
                    this.props.cache.clearAll();
                }}>
                    {({ height, width }) => (
                        <List
                            onRowsRendered={onRowsRendered}
                            deferredMeasurementCache={this.props.cache}
                            ref={list => {
                                this.list = list;
                                registerChild(list)
                            }}
                            rowCount={this.props.rowCount}
                            rowHeight={this.props.cache.rowHeight}
                            width={width}
                            height={height}
                            scrollToIndex={this.props.scrollTop === 0 ? 0 : -1}
                            onScroll={(x) => {
                                this.props.debouncedHandleScroll(x.scrollTop);
                            }}
                            rowRenderer={(x) => rowRenderer(x, this.props.items, this.props.cache,
                                this.props.onClick, this.props.template)}
                        />
                    )}
                </AutoSizer>
            )}
        </InfiniteLoader >;
    }
}