import * as React from 'react';
import tmpl from 'blueimp-tmpl';
import decorate, { Style } from './style';
import { WithStyles } from 'material-ui/styles/withStyles';
import { CardRecord } from '../../models/Card';
import { Icon } from 'material-ui';
import { CardTagRecord } from '../../models/CardTag';
import CardList from '../../modules/CardList';

class CardTagWrapper {
    constructor(tag: CardTagRecord, card: CardRecord) {
        this.tag = tag;
        this.card = card;
    }
    tag: CardTagRecord;
    card: CardRecord;

    get name() { return this.tag.name; }
    get value() { return this.tag.value; }
    get source() { return this.tag.source; }
    get target() { return this.tag.target; }
    get amount() { return this.tag.amount; }
    get quantity() { return this.tag.quantity; }
    get balance() { return this.card.getTagTotal(this.tag); }
}

interface TagsProps {
    card: CardRecord;
    handleCardClick: (card: CardRecord) => void;
}

const getCustomDisplay = (template: string, tag: CardTagWrapper) => {
    let content = tmpl(template, tag);
    return <div
        style={{ width: '100%' }}
        dangerouslySetInnerHTML={{ __html: content }}
    />;
};

const getDefaultDisplay = (card: CardRecord, tag: CardTagRecord, classes: Record<keyof Style, string>) => {
    let tagTotal = card.getTagTotal(tag);
    let st = tag.locationDisplay;
    return (
        <>
            <div className={classes.tagItemContent}>
                <div>{tag.display}</div>
                {st && <div style={{ fontSize: '0.75em' }}>
                    {tag.source}<Icon style={{
                        fontSize: '1.2em', verticalAlign: 'bottom', fontWeight: 'bold'
                    }}>keyboard_arrow_right</Icon>{tag.target}
                </div>}
            </div>
            <div className={classes.tagBalance}>
                {tagTotal !== 0 ? Math.abs(tagTotal).toFixed(2) : ''}
            </div>
        </>);
};

const getDisplayFor = (card: CardRecord, tag: CardTagRecord, classes: Record<keyof Style, string>) => {
    if (tag.typeId) {
        let tagType = CardList.tagTypes.get(tag.typeId);
        if (tagType && tagType.displayFormat) {
            return getCustomDisplay(tagType.displayFormat, new CardTagWrapper(tag, card));
        }
    }
    return getDefaultDisplay(card, tag, classes);
};

const sortIndex = (card: CardRecord, tag: CardTagRecord) => {
    CardList.getTagSortIndexByCard(card, tag);
};

const Tags = (props: TagsProps & WithStyles<keyof Style>) => {
    return (
        <div className={props.classes.tagSection}
            onClick={() => {
                props.handleCardClick(props.card);
            }}>
            {
                props.card.tags.entrySeq()
                    .sortBy(x => sortIndex(props.card, x[1]))
                    .map(([k, v]) => {
                        return (
                            <div
                                key={k}
                                className={props.classes.tagItem}
                            >
                                {getDisplayFor(props.card, v, props.classes)}
                            </div>);
                    })
            }
        </div>
    );
};

export default decorate(Tags);