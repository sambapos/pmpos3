import * as React from 'react';
import { Card } from 'material-ui';
import { CardRecord, CardTagRecord } from '../../models/Card';
import CardPageContent from './CardPageContent';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { Style } from './style';

interface SubCardProps {
    card: CardRecord;
    selectedCard: CardRecord;
    onClick: (card: CardRecord, target: any) => void;
    handleTagClick: (Card: CardRecord, value: CardTagRecord) => void;
}

const SubCards = (props: SubCardProps & WithStyles<keyof Style>) => {
    if (props.card.cards.count() === 0) { return null; }
    return (
        <Card className={props.classes.card}>
            {props.card.cards.map(card => {
                return (
                    <CardPageContent
                        key={card.id}
                        card={card}
                        selectedCard={props.selectedCard}
                        onClick={props.onClick}
                        handleTagClick={props.handleTagClick}
                    />
                );
            })}
        </Card >
    );
};

export default decorate(SubCards);