import * as React from 'react';
import CardPageContent from './CardPageContent';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { IStyle } from './style';
import * as _ from 'lodash';
import { CardRecord } from 'pmpos-models';
import { CardManager } from 'pmpos-modules';

interface ISubCardProps {
    card: CardRecord;
    selectedCardId: string;
    onClick: (card: CardRecord, target: any) => void;
    handleCardClick: (Card: CardRecord) => void;
}

type PageProps = ISubCardProps & WithStyles<keyof IStyle>;

class SubCards extends React.Component<PageProps, { tagCount: number }> {
    private subCardList: HTMLDivElement | null;
    private debouncedScrollBottom;

    constructor(props: PageProps) {
        super(props);
        this.state = { tagCount: props.card ? props.card.tags.count() : 0 };
    }

    public componentDidUpdate() {
        if (this.subCardList && this.props.card && this.state.tagCount !== this.props.card.cards.count()) {
            this.debouncedScrollBottom();
        }
    }

    public componentDidMount() {
        this.debouncedScrollBottom = _.debounce(this.scroll_bottom);
        this.debouncedScrollBottom();
    }

    public render() {
        if (this.props.card.cards.count() === 0) { return null; }
        return (
            <div
                className={this.props.classes.subCards}
                ref={(el) => { this.subCardList = el; }}
            >
                {this.props.card.cards
                    .valueSeq()
                    .sort((a, b) => a.time - b.time)
                    .map(card => {
                        return (
                            <CardPageContent
                                key={card.id}
                                card={card}
                                cardType={CardManager.getCardType(card.typeId)}
                                selectedCardId={this.props.selectedCardId}
                                onClick={this.props.onClick}
                                handleCardClick={this.props.handleCardClick}
                            />
                        );
                    })}
            </div>
        );
    }

    private scroll_bottom() {
        if (this.subCardList) {
            this.subCardList.scrollTop = this.subCardList.scrollHeight;
            this.setState({ tagCount: this.props.card ? this.props.card.cards.count() : 0 });
        }
    }

}

export default decorate(SubCards);