import * as React from 'react';
import { CardRecord, CardTagRecord } from '../../models/Card';
import CardPageContent from './CardPageContent';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { Style } from './style';

interface SubCardProps {
    card: CardRecord;
    onClick: (card: CardRecord, target: any) => void;
    handleTagClick: (Card: CardRecord, value: CardTagRecord) => void;
}

const SubCards = (props: SubCardProps & WithStyles<keyof Style>) => {
    if (props.card.cards.count() === 0) { return null; }
    return (
        <div>
            {props.card.cards.valueSeq().map(card => {
                return (
                    <CardPageContent
                        key={card.id}
                        card={card}
                        onClick={props.onClick}
                        handleTagClick={props.handleTagClick}
                    />
                );
            })}
        </div>
    );
};

export default decorate(SubCards);