import { List } from 'immutable';
import * as React from 'react';
import { ActionRecord } from '../models/Action';
import ActionItem from './ActionItem';

interface ActionListProps {
    actions: List<ActionRecord>;
}
export default (props: ActionListProps) => {
    if (props.actions.count() === 0) { return <div>No Actions</div>; }
    return (
        <div>
            {props.actions.map(action => <ActionItem key={action.id} action={action} />)}
        </div>
    );
};