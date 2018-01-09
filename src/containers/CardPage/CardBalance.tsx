import * as React from 'react';
import { Typography, ListItem } from 'material-ui';

export default (props) => {
    return props.card.balanceDisplay && (
        <ListItem>
            <Typography style={{ flex: 1 }} type="title">Balance</Typography>
            <Typography type="title">{props.card.balanceDisplay}</Typography>
        </ListItem>
    );
};