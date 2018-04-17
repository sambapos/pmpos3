import * as React from 'react';
import { ListItem, ListItemText, Icon } from 'material-ui';
import RuleManager from '../../modules/RuleManager';
import tmpl from 'blueimp-tmpl';
import CardList from '../../modules/CardList';
import { CardRecord, CardTagRecord } from 'pmpos-models';

const getTagDisplay = (card: CardRecord, tag: CardTagRecord) => {
    let tt = CardList.tagTypes.get(tag.typeId);
    if (tt && tt.icon) {
        if (tt.icon === '_') { return tag.valueDisplay; }
        return (<span style={{ display: 'inline-block' }}>
            <Icon style={{
                fontSize: '1rem', marginRight: 2, lineHeight: 'unset',
                height: 'auto', verticalAlign: 'bottom', opacity: 0.6
            }}>
                {tt.icon}
            </Icon>
            <span>{tag.valueDisplay}</span>
        </span>);
    }
    return tag.display;
};

const getDefaultContent = (card: CardRecord) => {
    return (
        <>
            <ListItemText
                primary={<div style={{ fontWeight: 400, fontSize: '1.1em' }}>{card.display}</div>}
                secondary={card.tags.valueSeq()
                    .sortBy(tag => CardList.getTagSortIndexByCard(card, tag))
                    .filter(tag => tag.name !== 'Name')
                    .map(tag => (
                        <span
                            style={{ marginRight: '8px' }}
                            key={tag.name}
                        >
                            {getTagDisplay(card, tag)}
                        </span>))}
            />
            <div style={{ float: 'right', right: 10, fontSize: '1.2em' }}>
                {card.balanceDisplay}
            </div>
        </>
    );
};

const getTemplatedContentFromRule = async (card: CardRecord, template?: string) => {
    let content = await RuleManager.getContent('GET_CONTENT', template, card, card);
    return <div
        style={{ width: '100%' }}
        dangerouslySetInnerHTML={{ __html: content.filter(x => x).join('\n') }}
    />;
};

const getTemplatedContent = (card: CardRecord, template: string) => {
    let content = tmpl(template, card);
    return <div
        style={{ width: '100%' }}
        dangerouslySetInnerHTML={{ __html: content }}
    />;
};

const getNullContent = (): JSX.Element => {
    return <div style={{ height: 100 }} />;
};

const isStaticContent = (template?: string) => {
    return !template || template.includes('{%');
};

const getStaticContent = (card: CardRecord, template?: string) => {
    if (isStaticContent(template)) {
        if (!template) {
            return getDefaultContent(card);
        } else {
            return getTemplatedContent(card, template);
        }
    }
    return getNullContent();
};

interface CardItemProps {
    card: CardRecord;
    onClick: (card: any) => void;
    onUpdate?: (card: any) => void;
    style?: any;
    template?: string;
}

export default class extends React.Component<CardItemProps, { content: JSX.Element }>  {
    constructor(props: CardItemProps) {
        super(props);
        this.state = { content: getStaticContent(props.card, props.template) };
    }

    componentDidMount() {
        if (!isStaticContent(this.props.template)) {
            getTemplatedContentFromRule(this.props.card, this.props.template)
                .then(x => {
                    if (this.props.onUpdate) {
                        this.props.onUpdate(this.props.card);
                    }
                    this.setState({ content: x });
                });
        }
    }

    componentWillReceiveProps(nextProps: CardItemProps) {
        if (nextProps.card !== this.props.card || nextProps.template !== this.props.template) {
            if (!isStaticContent(nextProps.template)) {
                getTemplatedContentFromRule(nextProps.card, nextProps.template)
                    .then(x => {
                        this.setState({ content: x });
                        if (this.props.onUpdate) {
                            this.props.onUpdate(this.props.card);
                        }
                    });
            } else {
                this.setState({ content: getStaticContent(nextProps.card, nextProps.template) });
                if (nextProps.onUpdate) {
                    nextProps.onUpdate(nextProps.card);
                }
            }
        }
    }

    render() {
        return (
            <ListItem button divider={this.props.template ? false : true}
                component="div"
                style={this.props.style}
                key={this.props.card.id}
                onClick={
                    () => this.props.onClick(this.props.card)
                }>
                {this.state.content}
            </ListItem >
        );
    }
}