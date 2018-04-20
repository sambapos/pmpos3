import * as React from 'react';
import * as h from './helpers';
import { Map as IMap } from 'immutable';
import decorate, { Style } from './style';
import CardItem from './CardItem';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { List, ListSubheader, WithStyles } from 'material-ui';

const cardRenderer = (card: any, index: number, onClick: (c: any) => void, template: string) => {
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
                            template={template}
                            card={card}
                            onClick={c => onClick(c)} />

                    </div>
                    {provided1.placeholder}
                </div>
            )}
        </Draggable>
    );
};

// const listRenderer = (cards, onDragEnd, onClick, template) => {
//     return (<DragDropContext onDragEnd={onDragEnd}>
//         <Droppable droppableId="droppable">
//             {(provided, snapshot) => (
//                 <div
//                     ref={provided.innerRef}
//                     style={h.getListStyle(snapshot.isDraggingOver)}
//                 >
//                     <List>
//                         {cards.map((item, index) => cardRenderer(item, index, onClick, template))}
//                     </List>
//                     {provided.placeholder}
//                 </div>
//             )}
//         </Droppable>
//     </DragDropContext>);
// };

interface DraggableCardListProps {
    items: IMap<string, any[]>;
    onDragEnd: (r: any) => void;
    onClick: (c: any) => void;
    template: string;
}

const draggableCardList = (props: DraggableCardListProps & WithStyles<keyof Style>) => {
    let displayCategories = props.items.count() > 1;
    return <List className={props.classes.draggableList} subheader={<li />}>
        {props.items.map((values, category) => (
            <li key={`section-${category}`}>
                <DragDropContext onDragEnd={props.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={h.getListStyle(snapshot.isDraggingOver)}
                            >
                                <ul className={props.classes.sectionList}>
                                    {displayCategories && <ListSubheader color="primary">
                                        {category || 'Uncategorized'}
                                    </ListSubheader>}
                                    {values.map(
                                        (item, index) => cardRenderer(item, index, props.onClick, props.template))}
                                </ul>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </li>
        )).valueSeq().toArray()}
    </List>;
};

export default decorate(draggableCardList);

// {[0, 1, 2, 3, 4].map(sectionId => (
//     <li key={`section-${sectionId}`} className={classes.listSection}>
//       <ul className={classes.ul}>
//         <ListSubheader>{`I'm sticky ${sectionId}`}</ListSubheader>
//         {[0, 1, 2].map(item => (
//           <ListItem key={`item-${sectionId}-${item}`}>
//             <ListItemText primary={`Item ${item}`} />
//           </ListItem>
//         ))}
//       </ul>
//     </li>
//   ))}