import * as React from 'react';
import { Card } from 'material-ui';
import { CardRecord } from '../../models/Card';
import CardPageContent from './CardPageContent';
import CardOperation from '../../modules/CardOperations/CardOperation';

interface SubCardProps {
    card: CardRecord;
    operations: CardOperation[];
    executeCardAction: (card: CardRecord, actionType: string, data: any) => void;
}

export default (props: SubCardProps) => {
    if (props.card.cards.count() === 0) { return null; }
    return (
        <Card>
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