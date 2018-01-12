import * as React from 'react';

export default (props) => {
    return (
        <thead>
            <tr>
                {props.keys.map(key => (<th id={key}>{key}</th>))}
            </tr>
        </thead>
    );
};