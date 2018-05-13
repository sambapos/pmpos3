import { List } from 'immutable';
import * as React from 'react';
import ActionItem from './ActionItem';
import { ActionRecord } from 'pmpos-models';

interface IActionListProps {
    actions: List<ActionRecord>;
}
export default (props: IActionListProps) => {
    if (props.actions.count() === 0) { return <div>No Actions</div>; }
    return (
        <div>
            {props.actions.map(action => <ActionItem key={action.id} action={action} />)}
        </div>
    );
};