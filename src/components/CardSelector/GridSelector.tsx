import * as React from 'react';
import { List } from 'immutable';
import CardSelectorButton from './CardSelectorButton';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { Style } from './style';
import SearchEdit from '../SearchEdit';
import { CardRecord, CardTypeRecord } from 'pmpos-models';
import { CardList } from 'pmpos-modules';
import CardLister from './CardLister';

interface GridSelectorProps {
    cards: List<CardRecord>;
    cardType: CardTypeRecord;
    sourceCardType: CardTypeRecord;
    sourceCards: List<CardRecord>;
    scrollTop: number;
    onScrollChange?: (scrollTop: number) => void;
    onSaveSortOrder?: (items: any[]) => void;
    onSelectCard?: (selectedCard: CardRecord, cardType: CardTypeRecord, cards: CardRecord[]) => void;
}

interface GridSelectorState {
    searchValue: string;
    scrollTop: number;
    items: List<CardRecord>;
}

class GridSelector extends React.Component<GridSelectorProps & WithStyles<keyof Style>, GridSelectorState> {
    constructor(props: GridSelectorProps & WithStyles<keyof Style>) {
        super(props);
        this.state = { searchValue: '', items: props.cards, scrollTop: 0 };
    }
    get isRegularList(): boolean {
        return this.props.sourceCardType.name === this.props.cardType.name;
    }
    updateSearchValue(searchValue: string) {
        let items = this.props.cards;
        if (searchValue) {
            items = List<CardRecord>(CardList.findCards(this.props.cardType, searchValue));
        }
        this.setState({ searchValue, items });
    }
    componentWillReceiveProps(props: GridSelectorProps) {
        if (props.cards !== this.state.items) {
            this.setState({ items: props.cards, searchValue: '' });
        }
    }
    getCardList() {
        return <CardLister
            cards={this.state.items}
            cardType={this.props.sourceCardType}
            onClick={c => {
                let sc: any[] = [];
                if (this.isRegularList) {
                    sc.push(c);
                } else {
                    sc = this.props.sourceCards
                        .filter(scs => scs.hasTag(this.props.cardType.reference, c.name)).toArray();
                }
                if (this.props.onSelectCard) {
                    this.props.onSelectCard(c, this.props.cardType, sc);
                }
            }}
            cardListScrollTop={this.props.scrollTop}
            onScrollChange={st => this.props.onScrollChange && this.props.onScrollChange(st)}
            onSaveSortOrder={items => this.props.onSaveSortOrder && this.props.onSaveSortOrder(items)}
        />;
    }
    getButtonList() {
        return this.state.items.toArray().map(card =>
            <CardSelectorButton
                key={card.id}
                card={card}
                cardType={this.props.cardType as CardTypeRecord}
                sourceCards={this.props.sourceCards.toArray()}
                onSelectCard={this.props.onSelectCard}
            />);
    }
    getList() {
        if (this.isRegularList || this.state.items !== this.props.cards) {
            return this.getCardList();
        }
        return this.getButtonList();
    }
    render() {
        return <div className={this.props.classes.content}>
            <SearchEdit value={this.state.searchValue}
                onChange={value => this.updateSearchValue(value)} />
            <div className={this.props.classes.container}>
                {this.getList()}
            </div>
        </div>;
    }
}

export default decorate(GridSelector);