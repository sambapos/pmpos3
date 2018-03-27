import * as React from 'react';
import * as h from './helpers';
import CardItem from './CardItem';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { List } from 'material-ui';

const cardRenderer = (card: any, index: number, onClick: (c: any) => void) => {
    return (
        <Draggable key={card.id} draggableId={card.id} index={index}>
            {(provided1, snapshot1) => (
                <div>
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
                            onClick={c => onClick(c)} />

                    </div>
                    {provided1.placeholder}
                </div>
            )}
        </Draggable>
    );
};

export default (props: {
    items: any[],
    onDragEnd: (r: any) => void,
    onClick: (c: any) => void
}) => {
    return <DragDropContext onDragEnd={props.onDragEnd}>
        <Droppable droppableId="droppable">
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    style={h.getListStyle(snapshot.isDraggingOver)}
                >
                    <List>
                        {props.items.map((item, index) => cardRenderer(item, index, props.onClick))}
                    </List>
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </DragDropContext>;
};