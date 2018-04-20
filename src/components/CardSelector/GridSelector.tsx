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
    items: List<CardRecord>;
}

class GridSelector extends React.Component<GridSelectorProps & WithStyles<keyof Style>, GridSelectorState> {
    constructor(props: GridSelectorProps & WithStyles<keyof Style>) {
        super(props);
        this.state = { searchValue: '', items: props.cards };
    }
    updateSearchValue(searchValue: string) {
        let items = searchValue ? CardList.findCards(this.props.cardType, searchValue) : this.props.cards;
        this.setState({ searchValue, items });
    }
    componentWillReceiveProps(props: GridSelectorProps) {
        if (props.cards !== this.state.items) {
            this.setState({ items: props.cards, searchValue: '' });
        }
    }
    getCardList(
        cards: List<CardRecord>
    ) {
        return <CardLister
            cards={cards}
            searchValue={this.state.searchValue}
            showAllCards={false}
            cardType={this.props.sourceCardType}
            onClick={c => {
                let sc: any[] = [];
                if (this.props.sourceCardType.name === this.props.cardType.name) {
                    sc.push(c);
                }
                if (this.props.onSelectCard) {
                    this.props.onSelectCard(c, this.props.cardType, sc);
                }
            }}
            cardListScrollTop={this.props.scrollTop}
            onScrollChange={st => this.props.onScrollChange && this.props.onScrollChange(st)}
            onSaveSortOrder={items => this.props.onSaveSortOrder && this.props.onSaveSortOrder(items)}
        />;
        // let groupedMap = IMap<string, any[]>(_.groupBy(cards, x => x.category));
        // return <>
        //     <DraggableCardList
        //         items={groupedMap}
        //         onDragEnd={r => false}
        //         template={this.props.cardType.displayFormat}
        //         onClick={c => {
        //             let sc: any[] = [];
        //             if (this.props.sourceCardType.name === this.props.cardType.name) {
        //                 sc.push(c);
        //             }
        //             if (this.props.onSelectCard) {
        //                 this.props.onSelectCard(c, this.props.cardType, sc);
        //             }
        //         }}
        //     />
        // </>;
    }
    getButtonList(cards: CardRecord[]) {
        return cards.map(card =>
            <CardSelectorButton
                key={card.id}
                card={card}
                cardType={this.props.cardType as CardTypeRecord}
                sourceCards={this.props.sourceCards.toArray()}
                onSelectCard={this.props.onSelectCard}
            />);
    }
    getList() {
        if (this.props.cardType.name === this.props.sourceCardType.name) {
            return this.getCardList(List<CardRecord>(this.props.sourceCards));
        }
        if (this.state.items !== this.props.cards) {
            return this.getCardList(List<CardRecord>(this.state.items));
        }
        return this.getButtonList(this.state.items.toArray());
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