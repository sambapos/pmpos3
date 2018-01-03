import * as React from 'react';
import { List } from 'immutable';
import { CommitRecord } from '../store/Cards/models';
import CommitItem from './CommitItem';

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