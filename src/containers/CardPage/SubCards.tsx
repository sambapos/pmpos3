import * as React from 'react';
import { Card } from 'material-ui';
import { CardRecord } from '../../models/Card';
import CardPageContent from './CardPageContent';
import CardOperation from '../../modules/CardOperations/CardOperation';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { Style } from './style';

interface SubCardProps {
    card: CardRecord;
    operations: CardOperation[];
    executeCardAction: (card: CardRecord, actionType: string, data: any) => void;
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
                        operations={props.operations}
                        executeCardAction={props.executeCardAction}
                    />
                );
            })}
        </Card >
    );
};

export default decorate(SubCards);