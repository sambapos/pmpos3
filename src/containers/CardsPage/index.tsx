import * as React from 'react';
import { connect } from 'react-redux';
import * as CardStore from '../../store/Cards';
import { RouteComponentProps } from 'react-router';
import { WithStyles } from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import { List } from 'immutable';
import TopBar from '../TopBar';
import { CardRecord } from '../../models/Card';

export type PageProps =
    { cards: List<CardRecord>, card: CardRecord }
    & WithStyles<keyof Style>
    & typeof CardStore.actionCreators
    & RouteComponentProps<{}>;

class CardsPage extends React.Component<PageProps, {}> {

    createTestCards() {
        for (let index = 0; index < 100; index++) {
            this.props.addCard();
            for (let index1 = 0; index1 < 50; index1++) {
                this.props.addPendingAction(undefined, 'SET_CARD_TAG', {
                    name: 'Tag' + index1, value: 'Value' + index1
                });
            }
            this.props.commitCard();
        }
    }

    public render() {
        return (
            <div>
                <TopBar title="Cards" />
                <button
                    onClick={() => {
                        this.props.addCard();
                        this.props.history.push('/card');
                    }}
                >Add Card
                </button>
                {/* <button
                    onClick={() => {
                        this.createTestCards();
                    }}
                >Add Test Cards
                </button> */}
                <ul>
                    {
                        this.props.cards.map(card => {
                            return card && (
                                <li key={card.id}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            this.props.history.push('/card/' + card.id);
                                            e.preventDefault();
                                        }}
                                    >
                                        {card.display}
                                    </a>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    cards: state.cards.cards,
    card: state.cards.currentCard
});

export default decorate(connect(
    mapStateToProps,
    CardStore.actionCreators
)(CardsPage));