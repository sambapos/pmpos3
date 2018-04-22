import * as React from 'react';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { Style } from './style';
import SearchEdit from '../SearchEdit';
import { CardRecord, CardTypeRecord } from 'pmpos-models';
import { CardList } from 'pmpos-modules';
import { List } from 'immutable';
import CardLister from './CardLister';
import GridSelector from '../GridSelector';

interface CardSelectorProps {
    sourceCards: List<CardRecord>;
    sourceCardType: CardTypeRecord;
    searchValue?: string;
    cardType?: string;
    scrollTop?: number;
    onSearchValueChange?: (searchValue: string) => void;
    onSaveSortOrder?: (items: CardRecord[]) => void;
    onScrollChange?: (scrollTop: number) => void;
    onSelectCard: (selectedCard: CardRecord, cardType: CardTypeRecord, cards: CardRecord[]) => void;
}

type Props = CardSelectorProps & WithStyles<keyof Style>;

interface CardSelectorState {
    searchValue: string;
    scrollTop: number;
    cardType: CardTypeRecord;
    items: List<CardRecord>;
    maybeVirtual: boolean;
}

const extractCardsfromSourceCardTags = (sourceCards: List<CardRecord>, tagTypeId: string) => {
    return sourceCards.reduce(
        (r, c) => {
            let tag = c.tags.find(t => t.typeId === tagTypeId);
            if (tag) {
                let card = CardList.cards.get(tag.cardId);
                if (card) { r = r.push(card); }
            }
            return r;
        },
        List<CardRecord>());
};

const findTagTypeIdReferencedToCardType = (cardType: CardTypeRecord, ref: string) => {
    return cardType.tagTypes.find(x => {
        let tt = CardList.tagTypes.get(x);
        return tt !== undefined && tt.cardTypeReferenceName === ref;
    });
};

const getCardList = (
    cardType: CardTypeRecord, sourceCardType: CardTypeRecord,
    sourceCards: List<CardRecord>, shortList: boolean, searchValue: string | undefined): List<CardRecord> => {
    if (cardType && cardType.name === sourceCardType.name) {
        return searchValue ? List<CardRecord>(CardList.findCards(cardType, searchValue)) : sourceCards;
    } else if (cardType) {
        if (shortList) {
            let cardList = CardList.getCardsByType(cardType.id).sortBy(x => x.name);
            return searchValue ? cardList.filter(c => c.includes(searchValue.toLowerCase())) : cardList;
        } else {
            if (searchValue) {
                return List<CardRecord>(CardList.findCards(cardType, searchValue));
            } else {
                let tagTypeId = findTagTypeIdReferencedToCardType(sourceCardType, cardType.reference);
                if (tagTypeId) {
                    return extractCardsfromSourceCardTags(sourceCards, tagTypeId);
                }
            }
        }
    }
    return List<CardRecord>();
};

class CardSelector extends React.Component<Props, CardSelectorState> {
    constructor(props: Props) {
        super(props);
        let cardType = this.getCardType(props.cardType);
        let maybeVirtual = CardList.getCount(cardType.name) > 100;
        let items = getCardList(
            cardType, props.sourceCardType, props.sourceCards,
            !maybeVirtual, props.searchValue
        );
        this.state = {
            searchValue: props.searchValue || '',
            cardType,
            items,
            scrollTop: 0,
            maybeVirtual
        };
    }
    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.cardType !== this.props.cardType && nextProps.searchValue) {
            this.updateSearchValue('');
            return;
        }
        if (nextProps.cardType !== this.props.cardType || nextProps.searchValue !== this.props.searchValue) {
            let cardType = this.getCardType(nextProps.cardType);
            let maybeVirtual = CardList.getCount(cardType.name) > 100;
            let items = getCardList(
                cardType, nextProps.sourceCardType, nextProps.sourceCards,
                !maybeVirtual, nextProps.searchValue
            );
            this.setState({
                searchValue: nextProps.searchValue || '',
                cardType,
                items,
                maybeVirtual,
                scrollTop: 0
            });
        }
    }
    get isRegularList(): boolean {
        return this.props.sourceCardType.name === this.state.cardType.name;
    }
    updateSearchValue(searchValue: string) {
        // let items = searchValue
        //     ? List<CardRecord>(CardList.findCards(this.state.cardType, searchValue))
        //     : getCardList(this.state.cardType, this.props.sourceCardType, this.props.sourceCards);
        this.setState({ searchValue });
        if (this.props.onSearchValueChange) {
            this.props.onSearchValueChange(searchValue);
        }
    }
    getCardType(cardTypeName: string | undefined) {
        let cardType = cardTypeName
            ? CardList.getCardTypeByRef(cardTypeName) as CardTypeRecord
            : this.props.sourceCardType;
        return cardType;
    }

    getItemList() {
        return <CardLister
            cards={this.state.items}
            cardType={this.props.sourceCardType}
            onClick={c => {
                let sc: any[] = [];
                if (this.isRegularList) {
                    sc.push(c);
                } else {
                    sc = this.props.sourceCards
                        .filter(scs => scs.hasTag(this.state.cardType.reference, c.name)).toArray();
                }
                if (this.props.onSelectCard) {
                    this.props.onSelectCard(c, this.state.cardType, sc);
                }
            }}
            cardListScrollTop={this.props.scrollTop || 0}
            onScrollChange={st => this.props.onScrollChange && this.props.onScrollChange(st)}
            onSaveSortOrder={items => this.props.onSaveSortOrder && this.props.onSaveSortOrder(items)}
        />;
    }
    getButtonList() {
        return <GridSelector
            items={this.state.items.toArray()}
            cardType={this.state.cardType}
            sourceCards={this.props.sourceCards.toArray()}
            onSelectCard={this.props.onSelectCard}
        />;
    }
    getList() {
        if (this.isRegularList || (this.props.searchValue && this.state.maybeVirtual)) {
            return this.getItemList();
        }
        return this.getButtonList();
    }

    render() {
        if (!this.state.cardType) {
            return (<div>Card Type `${this.props.cardType}` not found</div>);
        }
        return <div className={this.props.classes.content}>
            {this.props.onSearchValueChange && <SearchEdit value={this.state.searchValue}
                onChange={value => this.updateSearchValue(value)} />}
            <div className={this.props.classes.container}>
                {this.getList()}
            </div>
        </div>;
    }
}

export default decorate(CardSelector);