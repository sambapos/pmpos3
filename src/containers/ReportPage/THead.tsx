import * as React from 'react';

export default (props: { type: string, keys: string[] }) => {
    return (
        <thead>
            <tr key={'tr_' + props.type}>
                {props.keys.map(key => (<th key={props.type + '_' + key}>{key}</th>))}
            </tr>
        </thead>
    );
};