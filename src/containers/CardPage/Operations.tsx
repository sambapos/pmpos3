import * as React from 'react';
import CardOperation from '../../modules/CardOperations/CardOperation';

interface OperationsProps {
    operations: CardOperation[];
    onClick: (operation: CardOperation) => void;
}

export default (props: OperationsProps) => {
    return (
        <ul>
            {props.operations.map(x => (
                <li key={x.type}>
                    <a
                        href="#"
                        onClick={e => {
                            props.onClick(x);
                            e.preventDefault();
                        }}
                    >{x.description}
                    </a>
                </li>
            ))}
        </ul>
    );
};