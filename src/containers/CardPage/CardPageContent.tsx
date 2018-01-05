import * as React from 'react';
import Tags from './Tags';
import SubCards from './SubCards';
import { CardRecord, CardTagRecord } from '../../models/Card';
import { WithStyles, Icon } from 'material-ui';
import decorate, { Style } from './style';

interface CardContentProps {
    card: CardRecord;
    onClick: (card: CardRecord, target: any) => void;
    handleTagClick: (card: CardRecord, value: CardTagRecord) => void;
}

type PageProps = CardContentProps & WithStyles<keyof Style>;

const CardPageContent = (props: PageProps) => {
    console.log('c', props.card);
    return (
        <div className={props.card.cards.count() > 0 ? props.classes.node : props.classes.leaf} >
            <div className={props.classes.cardLine}>
                <Icon
                    onClick={e => props.onClick(props.card, e.target)}
                    color="primary"
                    className={props.classes.cardLineIcon}
                >
                    more_vert
                </Icon>
                <Tags card={props.card} handleTagClick={props.handleTagClick} />
            </div>
            <SubCards
                card={props.card}
                onClick={props.onClick}
                handleTagClick={props.handleTagClick}
            />
        </div>
    );
};

export default decorate(CardPageContent);