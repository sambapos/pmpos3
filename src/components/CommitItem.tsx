import * as React from 'react';
import { Card } from 'material-ui';
import * as moment from 'moment';
import Typography from 'material-ui/Typography/Typography';
import ActionList from './ActionList';
import { CommitRecord } from '../models/Commit';

interface CommitItemProps {
    commit: CommitRecord;
}

export default (props: CommitItemProps) => {
    return (
        <Card style={{ padding: '8px', marginBottom: '8px' }}>
            <Typography>id:{props.commit.id}</Typography>
            <Typography>terminal:{props.commit.terminalId}</Typography>
            <Typography>user:{props.commit.user}</Typography>
            <Typography>{moment(props.commit.time).format('LLLL')}</Typography>
            <ActionList actions={props.commit.actions} />
        </Card>
    );
};