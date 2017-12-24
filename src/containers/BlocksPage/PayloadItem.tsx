import * as React from 'react';
import { Typography } from 'material-ui';

export default (props: { name: string, value: string }) => {
    return <Typography>{`${props.name}:${props.value}`}</Typography>;
};