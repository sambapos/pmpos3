import * as React from 'react';
import { Map as IMap } from 'immutable';
import { Divider } from 'material-ui';
import Payload from './Payload';

export default (props: { action: IMap<string, any> }) => {
    console.log(props.action);
    return (
        <div>
            <Divider />
            <Payload item={props.action} />
        </div>
    );
};