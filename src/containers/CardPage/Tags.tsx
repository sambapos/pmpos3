import * as React from 'react';
import { CardRecord } from '../../models/Card';

interface TagsProps {
    card: CardRecord;
    handleTagClick: (key: string, value: string) => void;
}

export default (props: TagsProps) => {
    return (
        <ul>
            {
                props.card.tags.entrySeq().map(([k, v]: any[]) => {
                    return (<li
                        key={k}
                        onClick={e => props.handleTagClick(k, v)}
                    >{k}: {v}
                    </li>);
                })
            }
        </ul>
    );
};