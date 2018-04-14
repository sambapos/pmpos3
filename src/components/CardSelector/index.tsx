import * as React from 'react';
import { CardRecord } from '../../models/Card';
import CardList from '../../modules/CardList';
import { CardTypeRecord } from '../../models/CardType';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { Style } from './style';
import GridSelector from './GridSelector';

interface CardSelectorProps {
    sourceCards: CardRecord[];
    sourceCardType: CardTypeRecord;
    cardType: string;
    onSelectCard?: (selectedCard: CardRecord, cardType: CardTypeRecord, cards: CardRecord[]) => void;
}

const CardSelector = (props: CardSelectorProps & WithStyles<keyof Style>) => {
    let cardList: CardRecord[] = [];
    let cardCount = CardList.getCount(props.cardType);
    let cardType = CardList.getCardTypeByRef(props.cardType) as CardTypeRecord;
    if (!cardType) { return (<div>Card Type `${props.cardType}` not found</div>); }
    if (cardCount <= 100) {
        cardList = CardList.getCardsByType(cardType.id).sortBy(x => x.name).toArray();
    } else {
        let tagType = props.sourceCardType.tagTypes.find(x => {
            let tt = CardList.tagTypes.get(x);
            return tt !== undefined && tt.cardTypeReferenceName === cardType.reference;
        });
        if (tagType) {
            cardList = props.sourceCards.reduce(
                (r, c) => {
                    let tag = c.tags.find(t => t.typeId === tagType);
                    if (tag) {
                        let card = CardList.cards.get(tag.cardId);
                        if (card) { r.push(card); }
                    }
                    return r;
                },
                [] as CardRecord[]);
        }
    }
    return <GridSelector cards={cardList} sourceCards={props.sourceCards}
        cardType={cardType} onSelectCard={props.onSelectCard} />;
};

export default decorate(CardSelector);