import * as React from 'react';
import { CardRecord } from '../../models/Card';
import CardPageContent from './CardPageContent';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { Style } from './style';
import { CardTagRecord } from '../../models/CardTag';
import CardList from '../../modules/CardList';
import * as _ from 'lodash';

interface SubCardProps {
    card: CardRecord;
    selectedCardId: string;
    onClick: (card: CardRecord, target: any) => void;
    handleTagClick: (Card: CardRecord, value: CardTagRecord) => void;
}

type PageProps = SubCardProps & WithStyles<keyof Style>;

class SubCards extends React.Component<PageProps, { tagCount: number }> {
    subCardList: HTMLDivElement | null;
    private debouncedScrollBottom;

    constructor(props: PageProps) {
        super(props);
        this.state = { tagCount: props.card ? props.card.tags.count() : 0 };
    }

    componentDidUpdate() {
        if (this.subCardList && this.props.card && this.state.tagCount !== this.props.card.cards.count()) {
            this.debouncedScrollBottom();
        }
    }

    componentDidMount() {
        this.debouncedScrollBottom = _.debounce(this.scroll_bottom);
    }

    scroll_bottom() {
        if (this.subCardList) {
            this.subCardList.scrollTop = this.subCardList.scrollHeight;
        }
        this.setState({ tagCount: this.props.card ? this.props.card.cards.count() : 0 });
    }

    render() {
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
                                cardType={CardList.getCardType(card.typeId)}
                                selectedCardId={this.props.selectedCardId}
                                onClick={this.props.onClick}
                                handleTagClick={this.props.handleTagClick}
                            />
                        );
                    })}
            </div>
        );
    }
}

export default decorate(SubCards);