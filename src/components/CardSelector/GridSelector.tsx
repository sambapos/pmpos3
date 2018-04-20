import * as React from 'react';
import * as _ from 'lodash';
import { Map as IMap } from 'immutable';
import CardSelectorButton from './CardSelectorButton';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { Style } from './style';
import SearchEdit from '../SearchEdit';
import { CardRecord, CardTypeRecord } from 'pmpos-models';
import { CardList } from 'pmpos-modules';
import DraggableCardList from '../../components/DraggableCardList';

interface GridSelectorProps {
    cards: CardRecord[];
    cardType: CardTypeRecord;
    sourceCardType: CardTypeRecord;
    sourceCards: CardRecord[];
    onSelectCard?: (selectedCard: CardRecord, cardType: CardTypeRecord, cards: CardRecord[]) => void;
}

interface GridSelectorState {
    searchValue: string;
    items: CardRecord[];
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
        cards: CardRecord[]
    ) {
        let groupedMap = IMap<string, any[]>(_.groupBy(cards, x => x.category));
        return <>
            <DraggableCardList
                items={groupedMap}
                onDragEnd={r => false}
                template={this.props.cardType.displayFormat}
                onClick={c => this.props.onSelectCard &&
                    this.props.onSelectCard(c, this.props.cardType, [])}
            /></>;
    }
    getButtonList(cards: CardRecord[]) {
        return cards.map(card =>
            <CardSelectorButton
                key={card.id}
                card={card}
                cardType={this.props.cardType as CardTypeRecord}
                sourceCards={this.props.sourceCards}
                onSelectCard={this.props.onSelectCard}
            />);
    }
    getList() {
        if (this.state.items !== this.props.cards) {
            return this.getCardList(this.state.items);
        }
        return this.getButtonList(this.state.items);
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