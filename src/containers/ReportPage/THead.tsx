import * as React from 'react';

export default (props: { type: string, keys: string[] }) => {
    return (
        <thead>
            <tr>
                {props.keys.map(key => (<th id={props.type + '_' + key}>{key}</th>))}
            </tr>
        </thead>
    );
};