import * as React from 'react';
import classNames from 'classnames';
import { Button } from 'material-ui';
import { CardRecord } from '../../models/Card';
import { CardTypeRecord } from '../../models/CardType';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { Style } from './style';

interface CardSelectorButtonProps {
    card: CardRecord;
    cardType: CardTypeRecord;
    sourceCards: CardRecord[];
    onSelectCard?: (selectedCard: CardRecord, cardType: CardTypeRecord, cards: CardRecord[]) => void;
}

interface CardSelectorState {
    sourceCards: CardRecord[];
}

class CardSelectorButton extends React.Component<CardSelectorButtonProps & WithStyles<keyof Style>, CardSelectorState> {
    constructor(props: CardSelectorButtonProps & WithStyles<keyof Style>) {
        super(props);
        this.state = { sourceCards: this.getCardsByTag(props.sourceCards, props.cardType, props.card) };
    }

    getCardsByTag = (sourceCards: CardRecord[], cardType: CardTypeRecord, card: CardRecord) => {
        return sourceCards.filter(sc => sc.hasTag(cardType.reference, card.name));
    }

    componentWillReceiveProps(props: CardSelectorButtonProps) {
        if (props.sourceCards !== this.props.sourceCards) {
            this.setState({ sourceCards: this.getCardsByTag(props.sourceCards, props.cardType, props.card) });
        }
    }

    render() {
        return <Button variant="raised"
            color={this.state.sourceCards.length > 0 ? 'primary' : 'default'}
            className={classNames(this.props.classes.button, {
                [this.props.classes.highlightedButton]: this.state.sourceCards.length > 0
            })}
            onClick={() => this.props.onSelectCard
                && this.props.onSelectCard(this.props.card, this.props.cardType, this.state.sourceCards)}
        >
            {this.props.card.name}
        </Button>;
    }
}

export default decorate(CardSelectorButton);