import * as React from 'react';
import decorate, { Style } from './style';
import { WithStyles } from 'material-ui/styles/withStyles';
import { CardRecord } from '../../models/Card';
import { Icon } from 'material-ui';

interface TagsProps {
    card: CardRecord;
}

const Tags = (props: TagsProps & WithStyles<keyof Style>) => {
    return (
        <div className={props.classes.tagSection}>
            {
                props.card.tags.entrySeq().map(([k, v]) => {
                    let tagTotal = props.card.getTagTotal(v);
                    let st = v.locationDisplay;
                    return (
                        <div
                            key={k}
                            className={props.classes.tagItem}
                        >
                            <div className={props.classes.tagItemContent}>
                                <div>{v.display}</div>
                                {st && <div style={{ fontSize: '0.75em' }}>
                                    {v.source}<Icon style={{
                                        fontSize: '1.2em', verticalAlign: 'bottom', fontWeight: 'bold'
                                    }}>keyboard_arrow_right</Icon>{v.target}
                                </div>}
                            </div>
                            <div className={props.classes.tagBalance}>
                                {tagTotal !== 0 ? Math.abs(tagTotal).toFixed(2) : ''}
                            </div>
                        </div>);
                })
            }
        </div>
    );
};

export default decorate(Tags);