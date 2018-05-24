import * as React from 'react';
import { Card, Typography } from '@material-ui/core';
import * as moment from 'moment';
import ActionList from './ActionList';
import { CommitRecord } from 'pmpos-models';

interface ICommitItemProps {
    commit: CommitRecord;
}

export default (props: ICommitItemProps) => {
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