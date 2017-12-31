import * as React from 'react';
import { connect } from 'react-redux';
import * as CardStore from '../../store/Cards';
import { RouteComponentProps } from 'react-router';
import { WithStyles } from 'material-ui';
import decorate, { Style } from './style';
import * as moment from 'moment';
import { ApplicationState } from '../../store/index';
import TopBar from '../TopBar';
import { CardDataRecord, ActionRecord } from '../../store/Cards/models';
import { makeCommit, makeDeepCardData } from '../../store/Cards/makers';
import { uuidv4 } from '../../lib/uuid';
import { List } from 'immutable';

export type PageProps =
    {
        isLoaded: boolean,
        pendingActions: List<ActionRecord>
        cardData: CardDataRecord,
        protocol: any
    }
    & WithStyles<keyof Style>
    & typeof CardStore.actionCreators
    & RouteComponentProps<{ id?: string }>;

class CardPage extends React.Component<PageProps, {}> {
    public componentDidMount() {
        if (this.props.match.params.id) { this.props.loadCard(this.props.match.params.id); }
    }
    public render() {
        if (!this.props.isLoaded || !this.props.cardData) { return <div>Loading</div>; }
        return (
            <div>
                <TopBar
                    title="Card"
                    menuCommand={{ icon: 'close', onClick: () => { this.props.history.goBack(); } }}
                />
                <p>{this.props.cardData.card.id}</p>
                <p>{moment(this.props.cardData.card.time).format('LLLL')}</p>
                <button
                    onClick={
                        () => {
                            this.props.executeCardAction('SET_CARD_TAG', {
                                tagName: 'tag', tagValue: 'Value'
                            });
                        }
                    }
                >Add Tag
                </button>
                <button
                    onClick={
                        () => {
                            this.props.executeCardAction('SET_CARD_TAG', {
                                tagName: 'tag2', tagValue: 'Value2'
                            });
                        }
                    }
                >Add Tag2
                </button>
                <button
                    onClick={
                        () => {
                            if (this.props.pendingActions.count() > 0) {
                                let commit = makeCommit({
                                    id: uuidv4(),
                                    state: this.props.cardData.card,
                                    actions: this.props.pendingActions
                                });
                                let cd = this.props.protocol.get(this.props.cardData.card.id);
                                let cardData = cd ? makeDeepCardData(cd) : this.props.cardData;
                                cardData = cardData
                                    .update('commits', list => list.push(commit));
                                this.props.protocol.set(cardData.card.id, cardData.toJS());
                            }
                            this.props.commitCard();
                            this.props.history.push('/cards');
                        }
                    }
                >Commit
                </button>
                <ul>
                    {
                        this.props.cardData.card.tags.entrySeq().map(([k, v]: any[]) => {
                            return (<li key={k}>{k}:{v}</li>);
                        })
                    }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    protocol: state.cards.protocol,
    cardData: state.cards.currentCardData,
    pendingActions: state.cards.pendingActions,
    isLoaded: state.cards.isLoaded
});

export default decorate(connect(
    mapStateToProps,
    CardStore.actionCreators
)(CardPage));