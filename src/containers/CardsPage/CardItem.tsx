import * as React from 'react';
import { ListItem, ListItemText } from 'material-ui';
import * as tmpl from 'blueimp-tmpl';
import Interweave from 'interweave';
import { CardRecord } from '../../models/Card';

const getDefaultContent = (card: CardRecord) => {
    return (
        <>
            <ListItemText
                primary={card.display}
                secondary={card.tags.valueSeq()
                    .filter(tag => tag.name !== 'Name')
                    .map(tag => (
                        <span
                            style={{ marginRight: '8px' }}
                            key={tag.name}
                        >
                            {tag.display}
                        </span>))}
            />
            <div style={{ float: 'right', right: 10, fontSize: '1.2em' }}>
                {card.balanceDisplay}
            </div>
        </>
    );
};

const getTemplatedContent = (card: CardRecord, template: string) => {
    let content = tmpl(template, card);
    return (<Interweave
        tagName="div"
        content={content}
    />
    );
};

const getContent = (card: CardRecord, template?: string) => {
    if (template && template.includes('{%')) { return getTemplatedContent(card, template); }
    return getDefaultContent(card);
};

export default (props: {
    card: CardRecord,
    onClick: (card: any) => void,
    style?: any,
    template?: string
}) => {
    return (
        <ListItem button divider component="div"
            style={props.style}
            key={props.card.id}
            onClick={
                () => props.onClick(props.card)
            }>
            {getContent(props.card, props.template)}
        </ListItem>
    );
};