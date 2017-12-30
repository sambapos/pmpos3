import * as React from 'react';
import { connect } from 'react-redux';
import * as CardStore from '../../store/Cards';
import { RouteComponentProps } from 'react-router';
import { WithStyles } from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import { Map as IMap } from 'immutable';
import TopBar from '../TopBar';
import { CardData, CardDataRecord } from '../../store/Cards/models';
import { makeDeepCardData } from '../../store/Cards/makers';

export type PageProps =
    { cards: IMap<string, CardDataRecord> }
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
                        this.props.cards.entrySeq().map(([id, map]: any[]) => {
                            return (
                                <li key={id}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            let card = this.props.cards.get(id);
                                            console.log('cardDataRecord1', card);
                                            let js = card.toJS() as CardData;
                                            console.log('cardData', js);
                                            let cardDataRecord = makeDeepCardData(js);
                                            console.log('cardDataRecord2', cardDataRecord);
                                            this.props.history.push('/card/' + id);
                                            e.preventDefault();
                                        }}
                                    >
                                        {id}
                                        <br />
                                        {map.card.time}
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
    cards: state.cards.cardDataMap
});

export default decorate(connect(
    mapStateToProps,
    CardStore.actionCreators
)(CardsPage));