import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui';

const style = {
    cursor: 'move',
};

const ItemTypes = {
    LIST_ITEM: 'listItem',
};

const cardSource = {
    beginDrag(props: any) {
        return {
            id: props.id,
            index: props.index,
        };
    },
};

const cardTarget = {
    hover(props: any, monitor: any, component: any) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        // Time to actually perform the action
        props.moveListItem(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

const withDropTarget = DropTarget(ItemTypes.LIST_ITEM, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}));

const withDropSource = DragSource(ItemTypes.LIST_ITEM, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}));

class ReorderListItem extends React.Component<any> {
    render() {
        const {
            text,
            secondary,
            action,
            isDragging,
            connectDragSource,
            connectDropTarget,
            // props for onClick selection
            handleOnClick
            //
        } = this.props;
        const opacity = isDragging ? 0 : 1;

        return connectDragSource(
            connectDropTarget(
                <div style={{ ...style, opacity }}>
                    <ListItem button divider onClick={handleOnClick}>
                        <ListItemText
                            primary={text}
                            secondary={secondary}
                        />
                        <ListItemSecondaryAction style={{ right: 10, fontSize: '1.1 em' }}>
                            {action}
                        </ListItemSecondaryAction>
                    </ListItem>
                </div>)
        );
    }
}

export default withDropTarget(withDropSource(ReorderListItem));