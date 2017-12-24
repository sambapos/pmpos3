import * as React from 'react';
import { Typography } from 'material-ui';

export default (props: { isSelected: boolean, bid: string }) => {
    return props.isSelected
        ? <Typography type="body2">bid:{props.bid}</Typography>
        : <Typography>bid:{props.bid}</Typography>;
};