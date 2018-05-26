import * as React from 'react';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import decorate, { IStyle } from './style';
import SearchEdit from '../SearchEdit';
import { CardRecord, CardTypeRecord, CardManager, ConfigManager } from 'pmpos-core';
import { List } from 'immutable';
import CardLister from './CardLister';
import GridSelector from '../GridSelector';

interface ICardSelectorProps {
    sourceCards: List<CardRecord>;
    sourceCardType: CardTypeRecord;
    searchValue?: string;
    cardType?: string;
    scrollTop?: number;
    smallButtons?: boolean;
    onSearchValueChange?: (searchValue: string) => void;
    onSaveSortOrder?: (items: CardRecord[]) => void;
    onScrollChange?: (scrollTop: number) => void;
    onSelectCard: (selectedCard: CardRecord, cardType: CardTypeRecord, cards: CardRecord[]) => void;
}

type Props = ICardSelectorProps & WithStyles<keyof IStyle>;

interface ICardSelectorState {
    searchValue: string;
    scrollTop: number;
    cardType: CardTypeRecord;
    items: List<CardRecord>;
    maybeVirtual: boolean;
}

const extractCardsfromSourceCardTags = (sourceCards: List<CardRecord>, tagTypeId: string) => {
    return sourceCards.reduce(
        (r, c) => {
            const tag = c.tags.find(t => t.typeId === tagTypeId);
            if (tag) {
                const card = CardManager.getCardById(tag.cardId);
                if (card) { r = r.push(card); }
            }
            return r;
        },
        List<CardRecord>());
};

const findTagTypeIdReferencedToCardType = (cardType: CardTypeRecord, ref: string) => {
    return cardType.tagTypes.find(tagTypeId => {
        const tagType = ConfigManager.getTagTypeById(tagTypeId);
        return tagType !== undefined && tagType.cardTypeReferenceName === ref;
    });
};

const getCardList = (
    cardType: CardTypeRecord, sourceCardType: CardTypeRecord,
    sourceCards: List<CardRecord>, shortList: boolean, searchValue: string | undefined): List<CardRecord> => {
    if (cardType && cardType.name === sourceCardType.name) {
        return searchValue ? List<CardRecord>(CardManager.findCards(cardType, searchValue)) : sourceCards;
    } else if (cardType) {
        if (shortList) {
            const cardList = CardManager.getCardsByType(cardType.id).sortBy(x => x.name);
            return searchValue ? cardList.filter(c => c.includes(searchValue.toLowerCase())) : cardList;
        } else {
            if (searchValue) {
                return List<CardRecord>(CardManager.findCards(cardType, searchValue));
            } else {
                const tagTypeId = findTagTypeIdReferencedToCardType(sourceCardType, cardType.reference);
                if (tagTypeId) {
                    return extractCardsfromSourceCardTags(sourceCards, tagTypeId);
                }
            }
        }
    }
    return List<CardRecord>();
};

class CardSelector extends React.Component<Props, ICardSelectorState> {
    constructor(props: Props) {
        super(props);
        const cardType = this.getCardType(props.cardType);
        const maybeVirtual = CardManager.getCount(cardType.name) > 100;
        const items = getCardList(
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
    public componentWillReceiveProps(nextProps: Props) {
        if (nextProps.cardType !== this.props.cardType && nextProps.searchValue) {
            this.updateSearchValue('');
            return;
        }
        if (nextProps.cardType !== this.props.cardType || nextProps.searchValue !== this.props.searchValue) {
            const cardType = this.getCardType(nextProps.cardType);
            const maybeVirtual = CardManager.getCount(cardType.name) > 100;
            const items = getCardList(
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
        } else if (nextProps.sourceCards !== this.props.sourceCards) {
            const items = getCardList(
                this.state.cardType, nextProps.sourceCardType, nextProps.sourceCards,
                !this.state.maybeVirtual, nextProps.searchValue
            );
            this.setState({ items });
        }
    }
    get isRegularList(): boolean {
        return this.props.sourceCardType.name === this.state.cardType.name;
    }
    public updateSearchValue(searchValue: string) {
        this.setState({ searchValue });
        if (this.props.onSearchValueChange) {
            this.props.onSearchValueChange(searchValue);
        } else {
            const items = getCardList(
                this.state.cardType, this.props.sourceCardType, this.props.sourceCards,
                !this.state.maybeVirtual, searchValue
            );
            this.setState({ items });
        }
    }
    public getCardType(cardTypeName: string | undefined) {
        const cardType = cardTypeName
            ? ConfigManager.getCardTypeByRef(cardTypeName) as CardTypeRecord
            : this.props.sourceCardType;
        return cardType;
    }

    public getItemList() {
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
    public getButtonList() {
        return <GridSelector
            smallButtons={this.props.smallButtons}
            items={this.state.items.toArray()}
            cardType={this.state.cardType}
            sourceCards={this.props.sourceCards.toArray()}
            onSelectCard={this.props.onSelectCard}
        />;
    }
    public getList() {
        if (this.isRegularList || (this.state.searchValue && this.state.maybeVirtual)) {
            return this.getItemList();
        }
        return this.getButtonList();
    }

    public render() {
        if (!this.state.cardType) {
            return (<div>Card Type `${this.props.cardType}` not found</div>);
        }
        return <div className={this.props.classes.content}>
            <SearchEdit value={this.state.searchValue}
                onChange={value => this.updateSearchValue(value)} />
            <div className={this.props.classes.container}>
                {this.getList()}
            </div>
        </div>;
    }
}

export default decorate(CardSelector);