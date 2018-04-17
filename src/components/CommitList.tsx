import * as React from 'react';
import { List } from 'immutable';
import CommitItem from './CommitItem';
import { CommitRecord } from 'pmpos-models';

interface CommitListProps {
    commits: List<CommitRecord>;
}

export default (props: CommitListProps) => {
    return (
        <div>
            {props.commits.map(commit => <CommitItem commit={commit} key={commit.id} />)}
        </div>
    );
};