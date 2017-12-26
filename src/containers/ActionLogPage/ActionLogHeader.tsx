import * as React from 'react';
import { Typography } from 'material-ui';

export default (props: { isSelected: boolean, bid: string }) => {
    return props.isSelected
        ? <Typography type="body2">{props.bid}</Typography>
        : <Typography>{props.bid}</Typography>;
};