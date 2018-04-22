import * as React from 'react';
import * as h from '../helpers';
import * as _ from 'lodash';
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

interface DraggableCardListProps {
    items: any[];
    onDragEnd: (r: any) => void;
    onClick: (c: any) => void;
    template: string;
}

type Props = DraggableCardListProps & WithStyles<keyof Style>;

interface DraggableCardListState {
    items: IMap<string, any[]>;
}

class DraggableCardList extends React.Component<Props, DraggableCardListState> {
    constructor(props: Props) {
        super(props);
        this.state = { items: this.groupItems(props.items) };
    }
    groupItems(items: any[]): IMap<string, any[]> {
        if (items.length > 0) {
            let groupedItems = _.groupBy(items, x => x.category);
            return IMap<string, any[]>(groupedItems);
        }
        return IMap<string, any[]>();
    }
    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.items !== this.props.items) {
            this.setState({ items: this.groupItems(nextProps.items) });
        }
    }
    render() {
        let displayCategories = this.state.items.count() > 1;
        return <List className={this.props.classes.draggableList} subheader={<li />}>
            {this.state.items.map((values, category) => (
                <li key={`section-${category}`}>
                    <DragDropContext onDragEnd={this.props.onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={h.getListStyle(snapshot.isDraggingOver)}
                                >
                                    <ul className={this.props.classes.sectionList}>
                                        {displayCategories && <ListSubheader color="primary">
                                            {category || 'Uncategorized'}
                                        </ListSubheader>}
                                        {values.map(
                                            (item, index) =>
                                                cardRenderer(item, index, this.props.onClick, this.props.template))}
                                    </ul>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </li>
            )).valueSeq().toArray()}
        </List>;
    }
}

export default decorate(DraggableCardList);

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