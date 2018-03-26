import * as React from 'react';
import update from 'immutability-helper';
import { DragDropContext } from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';
import ReorderListItem from './ReorderListItem';
import { List } from 'material-ui';
import ItemPreview from './ItemPreview';

type ReorderableItem = {
    id: string;
    text: string;
    secondary: any;
    action: any;
};

interface ReorderListProps {
    items: ReorderableItem[];
    handleOnClick: (item: any) => void;
}

class ReorderList extends React.Component<ReorderListProps,
    { items: ReorderableItem[] }> {
    constructor(props: any) {
        super(props);
        this.state = {
            items: props.items
        };

        this.moveListItem = this.moveListItem.bind(this);
    }

    componentWillReceiveProps(nextProps: any) {
        this.setState({
            items: nextProps.items
        });
    }

    moveListItem(dragIndex: any, hoverIndex: any) {
        console.log('mli', dragIndex, hoverIndex);
        const { items } = this.state;
        const dragitem = items[dragIndex];

        this.setState(
            update(this.state, {
                items: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragitem]],
                }
            }),
        );
        // You may pass the state to props
        console.log(this.state.items);
    }

    render() {
        const { items } = this.state;
        return (
            <div>
                <ItemPreview key="__preview" name="Item" />
                <List>
                    {items.map((item, i) => (
                        <ReorderListItem
                            key={item.id}
                            handleOnClick={(e) => {
                                this.props.handleOnClick(item);
                                e.preventDefault();
                            }}
                            index={i}
                            id={item.id}
                            text={item.text}
                            secondary={item.secondary}
                            action={item.action}
                            moveListItem={this.moveListItem}
                        />
                    ))}
                </List>
            </div>
        );
    }
}

export default DragDropContext(TouchBackend({
    enableMouseEvents: true, delayTouchStart: 100
}))(ReorderList);