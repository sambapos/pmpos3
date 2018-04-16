import * as React from 'react';
import { List as IList } from 'immutable';
import { connect } from 'react-redux';
import * as CardStore from '../../../../store/Cards';
import CardSelector from '../../../../components/CardSelector';
import { CardTypeRecord } from '../../../../models/CardType';
import { CardRecord } from '../../../../models/Card';
import { ApplicationState } from '../../../../store';

interface CardSelectorComponentProps {
    cardType: string;
    cards: IList<CardRecord>;
    currentCardType: CardTypeRecord;
    onSelectCard: (card: CardRecord) => void;
}

type CardSelectorComponentPropType =
    CardSelectorComponentProps
    & typeof CardStore.actionCreators;

const CardSelectorComponent = (props: CardSelectorComponentPropType) => {
    return <CardSelector sourceCards={props.cards.filter(x => !x.isClosed).toArray()}
        sourceCardType={props.currentCardType}
        cardType={props.cardType}
        onSelectCard={c => props.onSelectCard(c)}
    />;
};

const mapStateToProps = (state: ApplicationState) => ({
    cards: state.cards.cards,
    currentCardType: state.cards.currentCardType
});

export default connect(
    mapStateToProps,
    CardStore.actionCreators
)(CardSelectorComponent);