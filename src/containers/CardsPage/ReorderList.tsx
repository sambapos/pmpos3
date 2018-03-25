import * as React from 'react';
import update from 'immutability-helper';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ReorderListItem from './ReorderListItem';
import { List } from 'material-ui';

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

class ReorderList extends React.Component<ReorderListProps, { items: ReorderableItem[] }> {
    constructor(props: any) {
        super(props);
        this.state = {
            items: props.items,
        };

        this.moveListItem = this.moveListItem.bind(this);
    }

    componentWillReceiveProps(nextProps: any) {
        this.setState({
            items: nextProps.items
        });
    }

    moveListItem(dragIndex: any, hoverIndex: any) {
        const { items } = this.state;
        const dragitem = items[dragIndex];

        this.setState(
            update(this.state, {
                items: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragitem]],
                },
            }),
        );
        // You may pass the state to props
        console.log(this.state.items);
    }

    render() {
        const { items } = this.state;
        return (
            <div>
                <List>
                    {items.map((item, i) => (
                        <ReorderListItem
                            key={item.id}
                            handleOnClick={() => this.props.handleOnClick(item)}
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

export default DragDropContext(HTML5Backend)(ReorderList);