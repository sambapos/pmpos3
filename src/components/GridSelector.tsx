import * as React from 'react';
import GridSelectorButton from './GridSelectorButton';
import { CardTypeRecord, CardRecord } from 'pmpos-core';

interface IGridSelectorProps {
    items: CardRecord[];
    cardType: CardTypeRecord;
    sourceCards: CardRecord[];
    smallButtons?: boolean;
    highlight?: string;
    onSelectCard: (selectedCard: CardRecord, cardType: CardTypeRecord, cards: CardRecord[]) => void;
}

export default (props: IGridSelectorProps) => {
    return <>
        {props.items.map(card =>
            <GridSelectorButton
                highlight={props.highlight}
                smallButton={props.smallButtons}
                key={'csb_' + card.id}
                card={card}
                cardType={props.cardType}
                sourceCards={props.sourceCards}
                onSelectCard={props.onSelectCard}
            />)}
    </>;
};