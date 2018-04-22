import * as React from 'react';
import GridSelectorButton from './GridSelectorButton';
import { CardTypeRecord, CardRecord } from 'pmpos-models';

interface GridSelectorProps {
    items: CardRecord[];
    cardType: CardTypeRecord;
    sourceCards: CardRecord[];
    onSelectCard: (selectedCard: CardRecord, cardType: CardTypeRecord, cards: CardRecord[]) => void;
}

export default (props: GridSelectorProps) => {
    return <>
        {props.items.map(card =>
            <GridSelectorButton
                key={'csb_' + card.id}
                card={card}
                cardType={props.cardType}
                sourceCards={props.sourceCards}
                onSelectCard={props.onSelectCard}
            />)}
    </>;
};