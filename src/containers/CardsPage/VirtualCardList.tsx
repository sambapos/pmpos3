import * as React from 'react';
import { InfiniteLoader, List, AutoSizer, CellMeasurer } from 'react-virtualized';
import CardItem from './CardItem';

const itemCount = 50;
const itemThresold = 25;

const cardRenderer = (
    { key, index, style, parent }: any,
    items: any[],
    cache: any,
    onClick: (c: any) => void,
    template: string
) => {

    if (index >= items.length) { return 'NA'; }
    var card = items[index];
    return (<CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
    >
        {({ measure }) => {
            return (
                <CardItem
                    template={template}
                    style={style}
                    card={card}
                    onUpdate={(c) => {
                        if (index < items.length) { cache.clear(index, 0); }
                    }}
                    onClick={c => onClick(c)} />
            );
        }}
    </CellMeasurer>
    );
};

interface VirtualCardListProps {
    rowCount: number;
    scrollTop: number;
    cache: any;
    isRowLoaded: (x: any) => void;
    loadMoreRows: (x: any) => void;
    onClick: (c: any) => void;
    debouncedHandleScroll: (x: number) => void;
    items: any[];
    template: string;
}

export default (props: VirtualCardListProps) => {
    return <InfiniteLoader
        isRowLoaded={(x) => props.isRowLoaded(x)}
        loadMoreRows={(x) => props.loadMoreRows(x)}
        rowCount={props.rowCount}
        minimumBatchSize={itemCount}
        threshold={itemThresold}
    >
        {({ onRowsRendered, registerChild }) => (
            <AutoSizer onResize={() => {
                props.cache.clearAll();
            }}>
                {({ height, width }) => (
                    <List
                        onRowsRendered={onRowsRendered}
                        deferredMeasurementCache={props.cache}
                        ref={registerChild}
                        rowCount={props.rowCount}
                        rowHeight={props.cache.rowHeight}
                        width={width}
                        height={height}
                        scrollToIndex={props.scrollTop === 0 ? 0 : -1}
                        scrollTop={props.scrollTop}
                        onScroll={(x) => {
                            props.debouncedHandleScroll(x.scrollTop);
                        }}
                        rowRenderer={(x) => cardRenderer(x, props.items, props.cache, props.onClick, props.template)}
                    />
                )}
            </AutoSizer>
        )}
    </InfiniteLoader>;
};
