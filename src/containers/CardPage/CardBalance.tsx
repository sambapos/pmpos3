import * as React from 'react';
import { Typography, ListItem } from 'material-ui';
import { CardRecord } from '../../models/Card';

interface Props {
    card: CardRecord;
}

export default (props: Props) => {
    return props.card.balanceDisplay
        ? (
            <ListItem>
                <Typography style={{ flex: 1 }} type="title">Balance</Typography>
                <Typography type="title">{props.card.balanceDisplay}</Typography>
            </ListItem>
        )
        : null;
};