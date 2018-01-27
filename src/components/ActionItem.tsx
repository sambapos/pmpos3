import Divider from 'material-ui/Divider/Divider';
import Typography from 'material-ui/Typography/Typography';
import * as React from 'react';
import { ActionRecord } from '../models/Action';

interface ActionItemProps {
    action: ActionRecord;
}

export default (props: ActionItemProps) => {
    return (
        <div>
            <Divider />
            <Typography type="body2">{props.action.actionType}</Typography>
            <Typography type="body1">ci:{props.action.cardId}</Typography>
            {props.action.concurrencyData
                && <Typography type="body1">cd:{`${JSON.stringify(props.action.concurrencyData)}`}</Typography>}
            <div>{Object.keys(props.action.data).map(key => {
                return (<div key={key}>
                    <Typography type="body1">{key}: {JSON.stringify(props.action.data[key])}</Typography>
                </div>);
            })}</div>
        </div>
    );
};