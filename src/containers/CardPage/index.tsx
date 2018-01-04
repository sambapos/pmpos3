import * as React from 'react';
import { connect } from 'react-redux';
import * as CardStore from '../../store/Cards';
import * as moment from 'moment';
import { RouteComponentProps } from 'react-router';
import { WithStyles, Typography } from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import TopBar from '../TopBar';
import { List } from 'immutable';
import { ActionRecord } from '../../models/Action';
import { CardRecord } from '../../models/Card';
import { cardOperations } from '../../modules/CardOperations';
import CardOperation from '../../modules/CardOperations/CardOperation';
import { CommitRecord } from '../../store/Cards/models';
import Commits from './Commits';
import CardPageContent from './CardPageContent';
import CardBalance from './CardBalance';

type PageProps =
    {
        isLoaded: boolean,
        pendingActions: List<ActionRecord>
        card: CardRecord,
        commits: List<CommitRecord>
    }
    & WithStyles<keyof Style>
    & typeof CardStore.actionCreators
    & RouteComponentProps<{ id?: string }>;

export class CardPage extends React.Component<
    PageProps,
    { operations: CardOperation[], showCommits: boolean }> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            operations: cardOperations.getOperations(),
            showCommits: false
        };
    }

    public componentDidMount() {
        if (this.props.match.params.id) { this.props.loadCard(this.props.match.params.id); }
    }

    public render() {
        if (!this.props.isLoaded || !this.props.card) { return <div>Loading</div>; }
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title={`Card (${this.props.card.id})`}
                    menuCommand={{ icon: 'close', onClick: () => { this.props.history.goBack(); } }}
                    secondaryCommands={[
                        {
                            icon: 'folder_open',
                            menuItems: [{
                                icon: 'Commits', onClick: () => {
                                    this.setState({ showCommits: true });
                                }
                            }]
                        },
                        {
                            icon: 'check', onClick: () => {
                                this.props.commitCard();
                                this.props.history.push('/cards');
                            }
                        }
                    ]}
                />
                <div className={this.props.classes.content}>
                    <div>
                        <Typography>{this.props.card.id}</Typography>
                        <Typography>{moment(this.props.card.time).format('LLL')}</Typography>
                    </div>
                    <CardPageContent
                        executeCardAction={this.props.addPendingAction}
                        card={this.props.card}
                        operations={this.state.operations}
                    />
                    {this.state.showCommits &&
                        <Commits
                            pendingActions={this.props.pendingActions}
                            commits={this.props.commits}
                        />
                    }
                </div >
                <div className={this.props.classes.footer}>
                    <CardBalance card={this.props.card} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    card: state.cards.currentCard,
    commits: state.cards.currentCommits,
    pendingActions: state.cards.pendingActions,
    isLoaded: state.cards.isLoaded
});

export default decorate(connect(
    mapStateToProps,
    CardStore.actionCreators
)(CardPage));