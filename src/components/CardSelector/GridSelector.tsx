import * as React from 'react';
import CardSelectorButton from './CardSelectorButton';
import { CardRecord } from '../../models/Card';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { Style } from './style';
import { CardTypeRecord } from '../../models/CardType';
import CardList from '../../modules/CardList';
import SearchEdit from '../SearchEdit';

interface GridSelectorProps {
    cards: CardRecord[];
    cardType: CardTypeRecord;
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
    render() {
        return <div className={this.props.classes.content}>
            <SearchEdit value={this.state.searchValue}
                onChange={value => this.updateSearchValue(value)} />
            <div className={this.props.classes.container}>
                {this.state.items.map(card =>
                    <CardSelectorButton
                        key={card.id}
                        card={card}
                        cardType={this.props.cardType as CardTypeRecord}
                        sourceCards={this.props.sourceCards}
                        onSelectCard={this.props.onSelectCard}
                    />)}
            </div>
        </div>;
    }
}

export default decorate(GridSelector);