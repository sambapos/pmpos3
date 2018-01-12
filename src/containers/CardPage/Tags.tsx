import * as React from 'react';
import { List, ListItem } from 'material-ui';
import decorate, { Style } from './style';
import { WithStyles } from 'material-ui/styles/withStyles';
import { CardTagRecord } from '../../models/CardTag';
import { CardRecord } from '../../models/Card';

interface TagsProps {
    card: CardRecord;
    handleTagClick: (card: CardRecord, value: CardTagRecord) => void;
}

const Tags = (props: TagsProps & WithStyles<keyof Style>) => {
    return (
        <List dense>
            {
                props.card.tags.entrySeq().map(([k, v]) => {

                    let st = v.locationDisplay;
                    return (
                        <ListItem
                            key={k}
                            button
                            className={props.classes.tagItem}
                            onClick={e => props.handleTagClick(props.card, v)}
                        >
                            <div className={props.classes.tagItemContent}>
                                <div>{v.display}</div>
                                {st && <div style={{ fontSize: '0.7em' }}>{st}</div>}
                            </div>
                            <div style={{ fontSize: '1.2em' }}>{v.totalAmountDisplay}</div>
                        </ListItem>);
                })
            }
        </List>
    );
};

export default decorate(Tags);