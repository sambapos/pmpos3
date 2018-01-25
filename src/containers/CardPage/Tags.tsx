import * as React from 'react';
import decorate, { Style } from './style';
import { WithStyles } from 'material-ui/styles/withStyles';
import { CardTagRecord } from '../../models/CardTag';
import { CardRecord } from '../../models/Card';
import { CardTypeRecord } from '../../models/CardType';

interface TagsProps {
    card: CardRecord;
    cardType: CardTypeRecord | undefined;
    handleTagClick: (card: CardRecord, value: CardTagRecord) => void;
}

const Tags = (props: TagsProps & WithStyles<keyof Style>) => {
    return (
        <div className={props.classes.tagSection}>
            {
                props.card.tags.entrySeq().map(([k, v]) => {

                    let st = v.locationDisplay;
                    return (
                        <div
                            key={k}
                            className={props.classes.tagItem}
                            onClick={e => props.handleTagClick(props.card, v)}
                        >
                            <div className={props.classes.tagItemContent}>
                                <div>{props.cardType
                                    ? v.getFormattedDisplay(props.cardType.displayFormat)
                                    : v.display}</div>
                                {st && <div style={{ fontSize: '0.7em' }}>{st}</div>}
                            </div>
                            <div
                                style={{ fontSize: '1.2em', padding: 8, color: v.balance > 0 ? 'inherit' : 'red' }}>
                                {v.totalAmountDisplay}
                            </div>
                        </div>);
                })
            }
        </div>
    );
};

export default decorate(Tags);