import * as React from 'react';
import DragLayer from 'react-dnd/lib/DragLayer';
import { ListItem } from 'material-ui';

function collect(monitor: any) {
    var item = monitor.getItem();

    return {
        id: item && item.id,
        name: item && item.name,
        currentOffset: monitor.getDifferenceFromInitialOffset(),
        beginningOffset: monitor.getInitialSourceClientOffset(),
        isDragging: monitor.isDragging()
    };
}

function getItemStyles(currentOffset: any, beginningOffset: any) {
    if (!currentOffset) {
        return {
            display: 'none'
        };
    }

    var transform = `translate(0px, ${currentOffset.y}px)`;

    return {
        pointerEvents: 'none',
        position: 'absolute' as 'absolute',
        left: beginningOffset.x,
        top: beginningOffset.y,
        transform: transform,
        WebkitTransform: transform
    };
}

function ItemPreview({
    id,
    name,
    isDragging,
    currentOffset,
    beginningOffset
}: any) {
    if (!isDragging) {
        return null;
    }

    return (
        <div
            className="item preview"
            style={getItemStyles(currentOffset, beginningOffset)}
        >
            <ListItem divider>{name}</ListItem>
        </div >
    );
}

export default DragLayer(collect)(ItemPreview);