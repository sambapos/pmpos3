import * as React from 'react';
import * as classNames from 'classnames';
import { Button } from '@material-ui/core';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import decorate, { IStyle } from './style';
import { CardRecord, CardTypeRecord } from 'sambadna-core';
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

    public isPrimary() {
        return this.state.sourceCards.length > 0;
    }

    public isSecondary() {
        return this.props.highlight != null && this.props.highlight === this.props.card.name
    }

    public isError() {
        return this.state.sourceCards.some(x => !x.isValid);
    }

    public render() {
        return <Button variant="raised"
            className={classNames(this.props.classes.button,
                {
                    [this.props.classes.bigButton]: !this.props.smallButton,
                    [this.props.classes.smallButton]: this.props.smallButton
                }, {
                    [this.props.classes.primaryButton]: this.isPrimary(),
                    [this.props.classes.secondaryButton]: this.isSecondary(),
                    [this.props.classes.errorButton]: this.isError()
                }
            )}
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