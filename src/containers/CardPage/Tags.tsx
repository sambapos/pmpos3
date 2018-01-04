import * as React from 'react';
import { CardRecord, CardTagRecord } from '../../models/Card';

interface TagsProps {
    card: CardRecord;
    handleTagClick: (key: string, value: CardTagRecord) => void;
}

export default (props: TagsProps) => {
    return (
        <ul>
            {
                props.card.tags.entrySeq().map(([k, v]) => {
                    let q = v.quantity > 0 ? v.quantity + ' ' : '';
                    let b = v.balance !== 0 ? v.balance : '';
                    let u = v.unit ? '.' + v.unit : '';
                    let vl = v.value ? q + v.value : '';
                    let key = !k || k[0] === '_' ? '' : k + ':';
                    return (<li
                        key={k}
                        onClick={e => props.handleTagClick(k, v)}
                    >{key}{vl}{u} {b}
                    </li>);
                })
            }
        </ul>
    );
};