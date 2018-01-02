import * as React from 'react';
import { connect } from 'react-redux';
import * as CardStore from '../../store/Cards';
import { RouteComponentProps } from 'react-router';
import { WithStyles } from 'material-ui';
import decorate, { Style } from './style';
import * as moment from 'moment';
import { ApplicationState } from '../../store/index';
import TopBar from '../TopBar';
import { List } from 'immutable';
import { ActionRecord } from '../../models/Action';
import { CardRecord } from '../../models/Card';

export type PageProps =
    {
        isLoaded: boolean,
        pendingActions: List<ActionRecord>
        card: CardRecord
    }
    & WithStyles<keyof Style>
    & typeof CardStore.actionCreators
    & RouteComponentProps<{ id?: string }>;

class CardPage extends React.Component<PageProps, {}> {
    public componentDidMount() {
        if (this.props.match.params.id) { this.props.loadCard(this.props.match.params.id); }
    }
    public render() {
        if (!this.props.isLoaded || !this.props.card) { return <div>Loading</div>; }
        return (
            <div>
                <TopBar
                    title="Card"
                    menuCommand={{ icon: 'close', onClick: () => { this.props.history.goBack(); } }}
                />
                <p>{this.props.card.id}</p>
                <p>{moment(this.props.card.time).format('LLLL')}</p>
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
                >Add Other Tag
                </button>
                <button
                    onClick={
                        () => {
                            this.props.commitCard();
                            this.props.history.push('/cards');
                        }
                    }
                >Commit
                </button>
                <ul>
                    {
                        this.props.card.tags.entrySeq().map(([k, v]: any[]) => {
                            return (<li key={k}>{k}:{v}</li>);
                        })
                    }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    card: state.cards.currentCard,
    pendingActions: state.cards.pendingActions,
    isLoaded: state.cards.isLoaded
});

export default decorate(connect(
    mapStateToProps,
    CardStore.actionCreators
)(CardPage));