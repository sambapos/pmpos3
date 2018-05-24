import * as React from 'react';
import { List as IList } from 'immutable';
import { connect } from 'react-redux';
import * as CardStore from '../store/Cards';
import CardSelector from '../components/CardSelector';
import { IApplicationState } from '../store';
import { CardRecord, CardTypeRecord } from 'pmpos-core';

interface ICardSelectorPageProps {
    cardType: string;
    cards: IList<CardRecord>;
    currentCardType: CardTypeRecord;
    onSelectCard: (card: CardRecord) => void;
}

type CardSelectorPagePropType =
    ICardSelectorPageProps
    & typeof CardStore.actionCreators;

const CardSelectorPage = (props: CardSelectorPagePropType) => {
    return <CardSelector
        sourceCards={props.cards.filter(x => !x.isClosed)}
        sourceCardType={props.currentCardType}
        cardType={props.cardType}
        onSelectCard={c => props.onSelectCard(c)}
        scrollTop={0}
    />;
};

const mapStateToProps = (state: IApplicationState) => ({
    cards: state.cards.cards,
    currentCardType: state.cards.currentCardType
});

export default connect(
    mapStateToProps,
    CardStore.actionCreators
)(CardSelectorPage);