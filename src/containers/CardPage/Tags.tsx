import * as React from 'react';
import { CardRecord, CardTagRecord } from '../../models/Card';
import { List, ListItem } from 'material-ui';
import decorate, { Style } from './style';
import { WithStyles } from 'material-ui/styles/withStyles';

interface TagsProps {
    card: CardRecord;
    handleTagClick: (card: CardRecord, value: CardTagRecord) => void;
}

const Tags = (props: TagsProps & WithStyles<keyof Style>) => {
    return (
        <List dense>
            {
                props.card.tags.entrySeq().map(([k, v]) => {
                    let q = v.quantity > 0 ? v.quantity + ' ' : '';
                    let b = v.balance !== 0 ? v.balance : '';
                    let u = v.unit ? '.' + v.unit : '';
                    let vl = v.value ? q + v.value : '';
                    let key = !k || k[0] === '_' ? '' : k + ': ';
                    let st = v.source || v.target ? `${v.source} > ${v.target}` : '';
                    return (
                        <ListItem
                            key={k}
                            button
                            className={props.classes.tagItem}
                            onClick={e => props.handleTagClick(props.card, v)}
                        >
                            <div className={props.classes.tagItemContent}>
                                <div>{key}{vl}{u}</div>
                                {st && <div style={{ fontSize: '0.7em' }}>{st}</div>}
                            </div>
                            <div style={{ fontSize: '1.2em' }}>{b}</div>
                        </ListItem>);
                })
            }
        </List>
    );
};

export default decorate(Tags);