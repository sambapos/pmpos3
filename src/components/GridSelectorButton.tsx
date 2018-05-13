import * as React from 'react';
import classNames from 'classnames';
import { Button } from 'material-ui';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { IStyle } from './style';
import { CardRecord, CardTypeRecord } from 'pmpos-models';

interface IGridSelectorButtonProps {
    card: CardRecord;
    cardType: CardTypeRecord;
    sourceCards: CardRecord[];
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

    public render() {
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

    private getCardsByTag = (sourceCards: CardRecord[], cardType: CardTypeRecord, card: CardRecord) => {
        return sourceCards.filter(sc => sc.hasTag(cardType.reference, card.name));
    }
}

export default decorate(GridSelectorButton);