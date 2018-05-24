import * as React from 'react';
import { List } from 'immutable';
import CommitItem from './CommitItem';
import { CommitRecord } from 'pmpos-core';

interface ICommitListProps {
    commits: List<CommitRecord>;
}

export default (props: ICommitListProps) => {
    return (
        <div>
            {props.commits.map(commit => <CommitItem commit={commit} key={commit.id} />)}
        </div>
    );
};