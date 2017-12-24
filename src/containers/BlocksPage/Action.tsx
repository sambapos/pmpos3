import * as React from 'react';
import { Map as IMap } from 'immutable';
import { Divider, Typography } from 'material-ui';
import Payload from './Payload';

export default (props: { action: IMap<string, any> }) => {
    return (
        <div>
            <Divider />
            <Typography>aid:{props.action.get('id')}</Typography>
            <Payload item={props.action.get('payload')} />
        </div>
    );
};