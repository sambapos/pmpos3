import * as React from 'react';
import * as h from '../helpers';
import * as _ from 'lodash';
import { Map as IMap } from 'immutable';
import decorate, { Style } from './style';
import { reorder } from '../../lib/helpers';
import CardItem from './CardItem';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { List, ListSubheader, WithStyles, Snackbar, Button, IconButton, Icon } from 'material-ui';

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
    template: string;
    onClick: (c: any) => void;
    onSaveSortOrder: (items: any[]) => void;
}

type Props = DraggableCardListProps & WithStyles<keyof Style>;

interface DraggableCardListState {
    items: IMap<string, any[]>;
    snackbarOpen: boolean;
}

class DraggableCardList extends React.Component<Props, DraggableCardListState> {
    constructor(props: Props) {
        super(props);
        this.state = { items: this.groupItems(props.items), snackbarOpen: false };
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
        return <>
            <List className={this.props.classes.draggableList} subheader={<li />}>
                {this.state.items.map((values, category) => (
                    <li key={`section-${category}`}>
                        <DragDropContext onDragEnd={(r) => this.onDragEnd(category, r)}>
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
            </List>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={this.state.snackbarOpen}
                onClose={this.handleSnackbarClose}
                SnackbarContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">Sort Order changed</span>}
                action={[
                    <Button key="save" color="secondary" size="small"
                        onClick={e => {
                            this.props.onSaveSortOrder(
                                this.state.items.reduce((r, i) => { r.push(...i); return r; }, [] as any[])
                            );
                            this.handleSnackbarClose(e);
                        }}>
                        Save
                        </Button>,
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={this.handleSnackbarClose}
                    >
                        <Icon>close</Icon>
                    </IconButton>,
                ]}
            />
        </>;
    }
    handleSnackbarClose = (event, reason?) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ snackbarOpen: false });
    }
    onDragEnd(category: string, result: any) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        if (result.source.index === result.destination.index) { return; }

        let items = reorder(
            this.state.items.get(category) as any[],
            result.source.index,
            result.destination.index
        );

        this.setState({
            items: this.state.items.set(category, items),
            snackbarOpen: true
        });
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