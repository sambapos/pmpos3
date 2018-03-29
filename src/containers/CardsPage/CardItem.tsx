import * as React from 'react';
import { ListItem, ListItemText } from 'material-ui';
import * as tmpl from 'blueimp-tmpl';
import Interweave from 'interweave';

const getDefaultContent = (card: any) => {
    return (
        <>
            <ListItemText
                primary={card.text}
                secondary={card.secondary}
            />
            <div style={{ float: 'right', right: 10, fontSize: '1.2 em' }}>
                {card.action}
            </div>
        </>
    );
};

const getTemplatedContent = (card: any, template: string) => {
    let content = tmpl(template, card);
    return (<Interweave
        tagName="div"
        content={content}
    />
    );
};

const getContent = (card: any, template?: string) => {
    if (template && template.includes('{%')) { return getTemplatedContent(card, template); }
    return getDefaultContent(card);
};

export default (props: {
    card: any,
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