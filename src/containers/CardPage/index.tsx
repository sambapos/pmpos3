import * as React from 'react';
import { connect } from 'react-redux';
import * as CardStore from '../../store/Cards';
import { RouteComponentProps } from 'react-router';
import { WithStyles } from 'material-ui';
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
                    title="Card"
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
                    <CardPageContent
                        executeCardAction={this.props.addPendingAction}
                        card={this.props.card}
                        operations={this.state.operations}
                    />
                    {/* <Tags card={this.props.card} handleTagClick={this.handleTagClick} />
                    <Operations operations={this.state.operations} onClick={op => this.handleOperation(op)} />
                    <SubCards card={this.props.card} /> */}
                    {this.state.showCommits &&
                        <Commits
                            pendingActions={this.props.pendingActions}
                            commits={this.props.commits}
                        />
                    }
                </div >
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