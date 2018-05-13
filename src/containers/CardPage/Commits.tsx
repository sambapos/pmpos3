import * as React from 'react';
import { List } from 'immutable';
import { WithStyles, Card, Typography } from 'material-ui';
import decorate, { IStyle } from './style';
import ActionList from '../../components/ActionList';
import CommitList from '../../components/CommitList';
import { CommitRecord, ActionRecord } from 'pmpos-models';

type CommitProps =
    {
        pendingActions: List<ActionRecord>;
        commits: List<CommitRecord>;
    }
    & WithStyles<keyof IStyle>;

const Commits = (props: CommitProps) => {
    return (
        <div style={{ wordWrap: 'break-word' }}>
            <Card className={props.classes.card}>
                <Typography>Pending Actions</Typography>
                <ActionList actions={props.pendingActions} />
            </Card>
            <CommitList commits={props.commits} />
        </div>
    );
};

export default decorate(Commits);