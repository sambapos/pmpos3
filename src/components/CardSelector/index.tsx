import * as React from 'react';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { Style } from './style';
import GridSelector from './GridSelector';
import { CardRecord, CardTypeRecord } from 'pmpos-models';
import { CardList } from 'pmpos-modules';
import { List } from 'immutable';

interface CardSelectorProps {
    sourceCards: List<CardRecord>;
    sourceCardType: CardTypeRecord;
    cardType: string;
    scrollTop: number;
    onSaveSortOrder?: (items: any[]) => void;
    onScrollChange?: (scrollTop: number) => void;
    onSelectCard?: (selectedCard: CardRecord, cardType: CardTypeRecord, cards: CardRecord[]) => void;
}

const CardSelector = (props: CardSelectorProps & WithStyles<keyof Style>) => {
    let cardList: List<CardRecord> = List<CardRecord>();
    let cardType = CardList.getCardTypeByRef(props.cardType) as CardTypeRecord;
    if (!cardType) { return (<div>Card Type `${props.cardType}` not found</div>); }
    if (cardType.name === props.sourceCardType.name) {
        cardList = props.sourceCards;
    } else {
        let cardCount = CardList.getCount(props.cardType);
        if (cardCount <= 100) {
            cardList = CardList.getCardsByType(cardType.id).sortBy(x => x.name);
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
                            if (card) { r = r.push(card); }
                        }
                        return r;
                    },
                    List<CardRecord>());
            }
        }
    }
    return <GridSelector cards={cardList}
        sourceCards={props.sourceCards}
        cardType={cardType}
        sourceCardType={props.sourceCardType}
        onSelectCard={props.onSelectCard}
        scrollTop={props.scrollTop}
        onScrollChange={props.onScrollChange}
        onSaveSortOrder={props.onSaveSortOrder}
    />;
};

export default decorate(CardSelector);