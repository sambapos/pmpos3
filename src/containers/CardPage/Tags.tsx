import * as React from 'react';
import tmpl from 'blueimp-tmpl';
import decorate, { Style } from './style';
import { WithStyles } from 'material-ui/styles/withStyles';
import { Icon } from 'material-ui';
import { CardRecord, CardTagRecord, TagTypeRecord } from 'pmpos-models';
import { CardList } from 'pmpos-modules';

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
    get price() { return this.tag.price; }
    get quantity() { return this.tag.quantity; }
    get balance() { return this.card.getTagTotal(this.tag); }
}

interface TagsProps {
    card: CardRecord;
    handleCardClick: (card: CardRecord) => void;
}

const getCustomDisplay = (template: string, tag: CardTagWrapper, classes: Record<keyof Style, string>) => {
    let content = tmpl(template, tag);
    return <div
        className={classes.tagItemContent}
        style={{ width: '100%' }}
        dangerouslySetInnerHTML={{ __html: content }}
    />;
};

const getTagDisplay = (card: CardRecord, tag: CardTagRecord, iconClass: string) => {
    let tt = CardList.tagTypes.get(tag.typeId);
    if (tt && tt.icon) {
        if (tt.icon === '_') { return tag.valueDisplay; }
        return (<span >
            <Icon className={iconClass}>
                {tt.icon}
            </Icon>
            <span>{tag.valueDisplay}</span>
        </span>);
    }
    return tag.display;
};

const getDefaultDisplay = (card: CardRecord, tag: CardTagRecord, classes: Record<keyof Style, string>) => {
    let tagTotal = card.getTagTotal(tag);
    let st = tag.locationDisplay;
    return (
        <>
            <div className={classes.tagItemContent}>
                <div>{getTagDisplay(card, tag, classes.icon)}</div>
                {st && <div className={classes.tagLocation}>
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

const getDisplayFor = (
    card: CardRecord, tag: CardTagRecord, tagType: TagTypeRecord | undefined,
    classes: Record<keyof Style, string>) => {
    if (tagType && tagType.displayFormat) {
        return getCustomDisplay(tagType.displayFormat, new CardTagWrapper(tag, card), classes);
    }
    return getDefaultDisplay(card, tag, classes);
};

const getTagItemClassName = (
    tag: CardTagRecord, tagType: TagTypeRecord | undefined, classes: Record<keyof Style, string>) => {
    if (!tagType) { return tag.price !== 0 || !tag.name.startsWith('_') ? classes.tagItemPrice : classes.tagItem; }
    return !tagType.icon || tagType.icon === '_' || tag.price > 0
        ? classes.tagItemPrice
        : classes.tagItem;
};

const Tags = (props: TagsProps & WithStyles<keyof Style>) => {
    return (
        <div className={props.classes.tagSection}
            onClick={() => {
                props.handleCardClick(props.card);
            }}>
            {
                props.card.tags.entrySeq()
                    .filter(x => props.card.tags.count() === 1 || x[1].name !== 'Name')
                    .sortBy(x => CardList.getTagSortIndexByCard(props.card, x[1]))
                    .map(([key, tag]) => {
                        let tagType = CardList.tagTypes.get(tag.typeId);
                        return (
                            <span
                                key={key}
                                className={getTagItemClassName(tag, tagType, props.classes)}
                            >
                                {getDisplayFor(props.card, tag, tagType, props.classes)}
                            </span>);
                    })
            }
        </div>
    );
};

export default decorate(Tags);