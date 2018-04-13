import * as React from 'react';
import { CardRecord } from '../../models/Card';
import CardList from '../../modules/CardList';
import { CardTypeRecord } from '../../models/CardType';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { Style } from './style';
import CardSelectorButton from './CardSelectorButton';

interface CardSelectorProps {
    sourceCards: CardRecord[];
    cardType: string;
    onSelectCard?: (selectedCard: CardRecord, cardType: CardTypeRecord, cards: CardRecord[]) => void;
}

const CardSelector = (props: CardSelectorProps & WithStyles<keyof Style>) => {
    let cardType = CardList.getCardTypeByRef(props.cardType);
    if (!cardType) { return (<div>Card Type `${props.cardType}` not found</div>); }
    let cards = CardList.getCardsByType(cardType.id).sortBy(x => x.name).take(50);
    console.log('renderRRR');
    return <div className={props.classes.container}>
        {cards.map(card => <CardSelectorButton
            key={card.id}
            card={card}
            cardType={cardType as CardTypeRecord}
            sourceCards={props.sourceCards}
            onSelectCard={props.onSelectCard}
        />)}
    </div>;
};

export default decorate(CardSelector);