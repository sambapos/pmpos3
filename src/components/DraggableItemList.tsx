import * as React from 'react';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import * as h from './helpers';
import { reorder } from '../lib/helpers';
import { Identifyable } from './Identifyable';
import { List, ListItem, WithStyles } from 'material-ui';
import decorate, { IStyle } from './style';

interface ItemListProps {
    onDragEnd: (items: Identifyable[]) => void;
    onClick?: (id: string) => void;
    items: Identifyable[];
}

const onDragEnd = (items: Identifyable[], result: any) => {
    if (!result.destination) {
        return items;
    }
    return reorder(
        items,
        result.source.index,
        result.destination.index
    ) as Identifyable[];
};

const DraggableItemList = (props: ItemListProps & WithStyles<keyof IStyle>) => {
    return (<DragDropContext onDragEnd={r => props.onDragEnd(onDragEnd(props.items, r))}>
        <Droppable droppableId="droppable">
            {(provided, snapshot) => (
                <div className={props.classes.list}
                    ref={provided.innerRef}
                    style={h.getListStyle(snapshot.isDraggingOver)}
                >
                    <List dense >
                        {props.items.map((tt, index) => {
                            return <Draggable key={tt.id} draggableId={tt.id} index={index}>
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
                                            <ListItem
                                                divider button key={tt.id}
                                                onClick={e => props.onClick && props.onClick(tt.id)}>
                                                {tt.name}
                                            </ListItem>
                                        </div>
                                        {provided1.placeholder}
                                    </div>
                                )}
                            </Draggable>;

                        })}
                    </List>
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </DragDropContext>);
};

export default decorate(DraggableItemList);