import * as React from 'react';
import { ActionRecord } from '../models/Action';
import Divider from 'material-ui/Divider/Divider';
import Typography from 'material-ui/Typography/Typography';

interface ActionItemProps {
    action: ActionRecord;
}

export default (props: ActionItemProps) => {
    return (
        <div>
            <Divider />
            <Typography type="body2">{props.action.actionType}</Typography>
            <div>{Object.keys(props.action.data).map(key => {
                return (<div key={key}>
                    <Typography type="body1">{key}: {props.action.data[key]}</Typography>
                </div>);
            })}</div>
        </div>
    );
};