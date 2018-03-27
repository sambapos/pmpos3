import * as React from 'react';
import { ListItem, ListItemText } from 'material-ui';

export default (props: { card: any, onClick: (card: any) => void, style?: any }) => {
    return (
        <ListItem button divider component="div"
            style={props.style}
            key={props.card.id}
            onClick={
                () => props.onClick(props.card)
            }>
            <ListItemText
                primary={props.card.text}
                secondary={props.card.secondary}
            />
            <div style={{ float: 'right', right: 10, fontSize: '1.2 em' }}>
                {props.card.action}
            </div>
        </ListItem>
    );
};