import * as React from 'react';
import { Typography, ListItem } from '@material-ui/core';
import { CardRecord } from 'sambadna-core';

interface ICardBalanceProps {
    card: CardRecord;
}

export default (props: ICardBalanceProps) => {
    return props.card.balanceDisplay
        ? (
            <ListItem>
                <Typography style={{ flex: 1 }} variant="title">Balance</Typography>
                <Typography variant="title">{props.card.balanceDisplay}</Typography>
            </ListItem>
        )
        : null;
};