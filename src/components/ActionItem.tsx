import Divider from 'material-ui/Divider/Divider';
import Typography from 'material-ui/Typography/Typography';
import * as React from 'react';
import { ActionRecord } from 'pmpos-models';

interface IActionItemProps {
    action: ActionRecord;
}

export default (props: IActionItemProps) => {
    return (
        <div>
            <Divider />
            <Typography variant="body2">{props.action.actionType}</Typography>
            <Typography variant="body1">i:{props.action.id}</Typography>
            <Typography variant="body1">ci:{props.action.cardId}</Typography>
            {props.action.concurrencyData
                && <Typography variant="body1">cd:{`${JSON.stringify(props.action.concurrencyData)}`}</Typography>}
            <div>{Object.keys(props.action.data).map(key => {
                return (<div key={key}>
                    <Typography variant="body1">{key}: {JSON.stringify(props.action.data[key])}</Typography>
                </div>);
            })}</div>
        </div>
    );
};