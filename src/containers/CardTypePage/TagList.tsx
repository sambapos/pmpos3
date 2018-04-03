import * as React from 'react';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import * as h from '../CardsPage/helpers';
import { List, ListItem } from 'material-ui';
import CardList from '../../modules/CardList';
import { Style } from './style';

interface TagListProps {
    onDragEnd: (r: any) => void;
    onClick: (id: string) => void;
    tagTypes: string[];
    classes: Record<keyof Style, string>;
}

export default (props: TagListProps) => {
    return (<DragDropContext onDragEnd={props.onDragEnd}>
        <Droppable droppableId="droppable">
            {(provided, snapshot) => (
                <div className={props.classes.list}
                    ref={provided.innerRef}
                    style={h.getListStyle(snapshot.isDraggingOver)}
                >
                    <List dense >
                        {props.tagTypes.map((tt, index) => {
                            let type = CardList.tagTypes.get(tt);
                            if (type) {
                                return <Draggable key={type.id} draggableId={type.id} index={index}>
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
                                                    divider button key={tt}
                                                    onClick={e => props.onClick(type ? type.id : '')}>
                                                    {type ? type.name : ''}
                                                </ListItem>
                                            </div>
                                            {provided1.placeholder}
                                        </div>
                                    )}
                                </Draggable>;
                            }
                            return <ListItem divider key={tt}>{tt} not found</ListItem>;
                        })}
                    </List>
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </DragDropContext>);
};