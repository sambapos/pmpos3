import * as React from 'react';
import classNames from 'classnames';
import { Button } from '@material-ui/core';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import decorate, { IStyle } from './style';
import { CardRecord, CardTypeRecord } from 'pmpos-core';
import { vibrate } from '../lib/helpers';

interface IGridSelectorButtonProps {
    card: CardRecord;
    cardType: CardTypeRecord;
    sourceCards: CardRecord[];
    smallButton?: boolean;
    highlight?: string;
    onSelectCard?: (selectedCard: CardRecord, cardType: CardTypeRecord, cards: CardRecord[]) => void;
}

interface IGridSelectorButtonState {
    sourceCards: CardRecord[];
}

type Props = IGridSelectorButtonProps & WithStyles<keyof IStyle>;

class GridSelectorButton extends React.Component<Props, IGridSelectorButtonState> {
    constructor(props: Props) {
        super(props);
        this.state = { sourceCards: this.getCardsByTag(props.sourceCards, props.cardType, props.card) };
    }

    public componentWillReceiveProps(props: IGridSelectorButtonProps) {
        if (props.sourceCards !== this.props.sourceCards) {
            this.setState({ sourceCards: this.getCardsByTag(props.sourceCards, props.cardType, props.card) });
        }
    }

    public getButtonColor() {
        if (this.props.highlight && this.props.card.name === this.props.highlight) {
            return 'secondary';
        }
        return this.state.sourceCards.length > 0 ? 'primary' : 'default'
    }

    public render() {
        return <Button variant="raised"
            color={this.getButtonColor()}
            className={classNames(this.props.classes.button, {
                [this.props.classes.highlightedButton]: this.state.sourceCards.length > 0,
                [this.props.classes.bigButton]: !this.props.smallButton,
                [this.props.classes.smallButton]: this.props.smallButton
            })}
            onClick={() => {
                if (this.props.onSelectCard) {
                    vibrate([10]);
                    this.props.onSelectCard(this.props.card, this.props.cardType, this.state.sourceCards)
                }
            }}
        >
            {this.props.card.name}
        </Button>;
    }

    private getCardsByTag = (sourceCards: CardRecord[], cardType: CardTypeRecord, card: CardRecord) => {
        return sourceCards.filter(sc => sc.hasTag(cardType.reference, card.name));
    }
}

export default decorate(GridSelectorButton);