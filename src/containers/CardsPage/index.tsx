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
    { cards: List<CardRecord> }
    & WithStyles<keyof Style>
    & typeof CardStore.actionCreators
    & RouteComponentProps<{}>;

class CardsPage extends React.Component<PageProps, {}> {
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
                                        {card.id}
                                        <br />
                                        {card.time}
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
    cards: state.cards.cards
});

export default decorate(connect(
    mapStateToProps,
    CardStore.actionCreators
)(CardsPage));