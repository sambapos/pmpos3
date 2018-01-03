import * as React from 'react';
import { ActionRecord } from '../../models/Action';
import { List } from 'immutable';
import { CommitRecord } from '../../store/Cards/models';
import { WithStyles, Card, Typography } from 'material-ui';
import decorate, { Style } from './style';
import ActionList from '../../components/ActionList';
import CommitList from '../../components/CommitList';

type CommitProps =
    {
        pendingActions: List<ActionRecord>;
        commits: List<CommitRecord>;
    }
    & WithStyles<keyof Style>;

const Commits = (props: CommitProps) => {
    return (
        <div>
            <Card className={props.classes.card}>
                <Typography>Pending Actions</Typography>
                <ActionList actions={props.pendingActions} />
            </Card>
            <CommitList commits={props.commits} />
        </div>
    );
};

export default decorate(Commits);