import * as React from 'react';
import { Typography, ListItem } from 'material-ui';
import { CardRecord } from 'pmpos-models';

interface Props {
    card: CardRecord;
}

export default (props: Props) => {
    return props.card.balanceDisplay
        ? (
            <ListItem>
                <Typography style={{ flex: 1 }} variant="title">Balance</Typography>
                <Typography variant="title">{props.card.balanceDisplay}</Typography>
            </ListItem>
        )
        : null;
};