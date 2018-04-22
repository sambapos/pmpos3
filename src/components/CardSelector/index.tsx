import * as React from 'react';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { Style } from './style';
import CardItemSelector from './CardItemSelector';
import { CardRecord, CardTypeRecord } from 'pmpos-models';
import { CardList } from 'pmpos-modules';
import { List } from 'immutable';

interface CardSelectorProps {
    sourceCards: List<CardRecord>;
    sourceCardType: CardTypeRecord;
    cardType?: string;
    scrollTop?: number;
    onSaveSortOrder?: (items: CardRecord[]) => void;
    onScrollChange?: (scrollTop: number) => void;
    onSelectCard: (selectedCard: CardRecord, cardType: CardTypeRecord, cards: CardRecord[]) => void;
}

type Props = CardSelectorProps & WithStyles<keyof Style>;

interface CardSelectorState {

}

class CardSelector extends React.Component<Props, CardSelectorState> {
    getCardList(cardType: CardTypeRecord) {
        let cardList: List<CardRecord> = List<CardRecord>();
        if (cardType.name === this.props.sourceCardType.name) {
            cardList = this.props.sourceCards;
        } else if (this.props.cardType) {
            let cardCount = CardList.getCount(this.props.cardType);
            if (cardCount <= 100) {
                cardList = CardList.getCardsByType(cardType.id).sortBy(x => x.name);
            } else {
                let tagType = this.props.sourceCardType.tagTypes.find(x => {
                    let tt = CardList.tagTypes.get(x);
                    return tt !== undefined && tt.cardTypeReferenceName === cardType.reference;
                });
                if (tagType) {
                    cardList = this.props.sourceCards.reduce(
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
        return cardList;
    }

    render() {
        let cardType = this.props.cardType
            ? CardList.getCardTypeByRef(this.props.cardType) as CardTypeRecord
            : this.props.sourceCardType;
        if (!cardType) { return (<div>Card Type `${this.props.cardType}` not found</div>); }

        let cardList = this.getCardList(cardType);

        return <CardItemSelector cards={cardList}
            sourceCards={this.props.sourceCards}
            cardType={cardType}
            sourceCardType={this.props.sourceCardType}
            onSelectCard={this.props.onSelectCard}
            scrollTop={this.props.scrollTop || 0}
            onScrollChange={this.props.onScrollChange}
            onSaveSortOrder={this.props.onSaveSortOrder}
        />;
    }
}

export default decorate(CardSelector);