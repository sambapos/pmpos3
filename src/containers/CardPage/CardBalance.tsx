import * as React from 'react';
import { Typography } from 'material-ui';

export default (props) => {
    return (
        <Typography type="body2">Balance:{props.card.balanceDisplay}</Typography>
    );
};