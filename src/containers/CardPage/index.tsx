import * as React from 'react';
import { connect } from 'react-redux';
import * as CardStore from '../../store/Cards';
import { RouteComponentProps } from 'react-router';
import { WithStyles, Modal, Typography } from 'material-ui';
import decorate, { Style } from './style';
import * as moment from 'moment';
import { ApplicationState } from '../../store/index';
import TopBar from '../TopBar';
import { List } from 'immutable';
import { ActionRecord } from '../../models/Action';
import { CardRecord } from '../../models/Card';
import { cardOperations } from '../../modules/CardOperations';
import CardOperation from '../../modules/CardOperations/CardOperation';
import { CommitRecord } from '../../store/Cards/models';
import Commits from './Commits';

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
    { operations: CardOperation[], operationComponent: any, open: boolean, showCommits: boolean }> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            operations: cardOperations.getOperations(),
            operationComponent: undefined,
            open: false,
            showCommits: false
        };
    }

    handleCardMutation = (actionType: string, data: any) => {
        this.setState({ open: false });
        this.props.executeCardAction(actionType, data);
    }

    handleOpen = () => {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    handleTagClick = (tagName, tagValue) => {
        let op = this.state.operations.find(x => x.type === 'SET_CARD_TAG');
        if (op) {
            this.setState({
                open: true,
                operationComponent: op.getEditor
                    && op.getEditor(this.handleCardMutation, { tagName, tagValue })
            });
        }
    }

    public componentDidMount() {
        if (this.props.match.params.id) { this.props.loadCard(this.props.match.params.id); }
    }

    public render() {
        if (!this.props.isLoaded || !this.props.card) { return <div>Loading</div>; }
        return (
            <div className={this.props.classes.root}>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div className={this.props.classes.modal}>
                        {this.state.operationComponent}
                    </div>
                </Modal>
                <TopBar
                    title="Card"
                    menuCommand={{ icon: 'close', onClick: () => { this.props.history.goBack(); } }}
                    secondaryCommands={[
                        {
                            icon: 'check', onClick: () => {
                                this.props.commitCard();
                                this.props.history.push('/cards');
                            }
                        }
                    ]}
                />
                <Typography>{this.props.card.id}</Typography>
                <Typography>{moment(this.props.card.time).format('LLLL')}</Typography>
                <div className={this.props.classes.content}>
                    <ul>
                        {this.state.operations.map(x => (
                            <li key={x.type}>
                                <a
                                    href="#"
                                    onClick={e => {
                                        this.setState({
                                            open: true,
                                            operationComponent: x.getEditor && x.getEditor(this.handleCardMutation)
                                        });
                                        e.preventDefault();
                                    }}
                                >{x.description}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <ul>
                        {
                            this.props.card.tags.entrySeq().map(([k, v]: any[]) => {
                                return (<li
                                    key={k}
                                    onClick={e => this.handleTagClick(k, v)}
                                >{k}: {v}
                                </li>);
                            })
                        }
                    </ul>
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