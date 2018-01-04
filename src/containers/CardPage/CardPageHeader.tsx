import * as React from 'react';
import * as moment from 'moment';
import { Typography } from 'material-ui';
import { CardRecord } from '../../models/Card';

export default (props: { card: CardRecord }) => {
    return (
        <div>
            <Typography>{props.card.id}</Typography>
            <Typography>{moment(props.card.time).format('LLLL')}</Typography>
            <Typography>Balance:{props.card.balance}</Typography>
        </div>
    );
};