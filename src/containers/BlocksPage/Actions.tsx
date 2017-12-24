import * as React from 'react';
import { List } from 'immutable';
import Action from './Action';

export default (props: { items: List<any> }) => {
    return (
        <div>{
            props.items.toSeq().map(action =>
                <Action key={action.get('id')} action={action} />
            )}
        </div>
    );
};