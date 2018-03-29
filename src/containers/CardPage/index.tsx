import * as React from 'react';
import * as moment from 'moment';
import * as shortid from 'shortid';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as CardStore from '../../store/Cards';
import * as ClientStore from '../../store/Client';
import { ApplicationState } from '../../store/index';

import { WithStyles, Typography, Menu, MenuItem, Paper, Divider, Button } from 'material-ui';
import decorate, { Style } from './style';
import * as Extender from '../../lib/Extender';
import TopBar from '../TopBar';
import { List } from 'immutable';
import { ActionRecord } from '../../models/Action';
import { CardRecord } from '../../models/Card';
import { CommitRecord } from '../../models/Commit';
import { cardOperations } from '../../modules/CardOperations';
import CardOperation from '../../modules/CardOperations/CardOperation';

import Commits from './Commits';
import CardPageContent from './CardPageContent';
import CardBalance from './CardBalance';
import CardList from '../../modules/CardList';
import { CommandButton } from './CommandButton';
import { Fragment } from 'react';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';
import { CardTypeRecord } from '../../models/CardType';

type PageProps =
    {
        isLoaded: boolean,
        pendingActions: List<ActionRecord>
        card: CardRecord,
        commits: List<CommitRecord>
    }
    & WithStyles<keyof Style>
    & typeof CardStore.actionCreators
    & typeof ClientStore.actionCreators
    & RouteComponentProps<{ id?: string }>;

interface PageState {
    anchorEl: any;
    operations: CardOperation[];
    selectedCard: CardRecord;
    buttons: CommandButton[];
    footerButtons: CommandButton[];
}

export class CardPage extends React.Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            anchorEl: undefined,
            operations: cardOperations.getOperations(),
            selectedCard: props.card,
            buttons: [],
            footerButtons: this.getButtons(props.card)
        };
    }

    handleModalClose = () => {
        this.props.SetModalState(false);
    }

    handleMenuClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleMenuClose = () => {
        this.setState({ anchorEl: undefined });
    }

    handleCardMutation = (card: CardRecord, actionType: string, data: any) => {
        this.props.addPendingAction(card, actionType, data);
        this.handleModalClose();
    }

    handleOperation(operation: CardOperation, currentData?: any) {
        if (operation.getEditor) {
            let component = operation.getEditor(
                (at, data) => this.handleCardMutation(this.state.selectedCard, at, data),
                () => { this.handleModalClose(); },
                currentData);
            if (component) {
                this.props.SetModalComponent(component);
            }
        } else {
            this.handleCardMutation(this.state.selectedCard, operation.type, {
                id: shortid.generate(), time: new Date().getTime()
            });
        }
    }

    handleButtonClick(card: CardRecord, button: CommandButton) {
        this.handleCardMutation(card, 'EXECUTE_COMMAND', {
            name: button.command,
            params: button.parameters
        });
    }

    public componentDidMount() {
        if (this.props.match.params.id) {
            this.props.loadCard(this.props.match.params.id);
        }
        if (this.props.isLoaded) {
            this.setState({
                selectedCard: this.props.card,
            });
        }
    }

    public componentWillReceiveProps(props: PageProps) {
        if (props.isLoaded) {
            this.setState({ footerButtons: this.getButtons(props.card) });
        }
    }

    getTitle() {
        let ct = CardList.getCardType(this.props.card.typeId);
        let cap = ct ? ct.reference : `Card`;
        return !this.props.card.name
            ? `New ${cap}`
            : `${this.props.card.display}`;
    }

    getButtonsForCommand(command: string): CommandButton[] {
        if (!command.includes('=')) {
            let parts = command.split(':');
            let ct = CardList.getCardTypes().find(c => c.name === parts[1]);
            if (ct) {
                let cards = CardList.getCardsByType(ct.id);
                return cards.map(c =>
                    new CommandButton(`${c.name}=${parts[0]}:${
                        c.tags.reduce((r, t) => r + (r ? ',' : '') + `${t.name}=${t.value}`, '')
                        }`)).toArray();
            }
        }
        return [new CommandButton(command)];
    }

    reduceButtons(ct: CardTypeRecord) {
        return ct.commands.filter(c => c).reduce(
            (r, c) => r.concat(this.getButtonsForCommand(c)),
            new Array<CommandButton>());
    }

    getButtons(card: CardRecord): CommandButton[] {
        let ct = CardList.getCardTypes().get(card.typeId);
        return ct
            ? this.reduceButtons(ct)
            : [];
    }

    public render() {
        if (!this.props.isLoaded || !this.props.card) {
            return (
                <div>
                    <TopBar
                        title="Loading...."
                    />
                </div>
            );
        }

        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title={this.getTitle()}
                    menuCommand={{ icon: 'close', onClick: () => { this.props.history.goBack(); } }}
                    secondaryCommands={[
                        {
                            icon: 'folder_open',
                            menuItems: [{
                                icon: 'Display Commits', onClick: () => {
                                    this.props.SetModalComponent((
                                        <Fragment>
                                            <DialogContent>
                                                <Commits
                                                    pendingActions={this.props.pendingActions}
                                                    commits={this.props.commits}
                                                />
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => this.props.SetModalState(false)}>Close</Button>
                                            </DialogActions>
                                        </Fragment>
                                    ));

                                }
                            }]
                        },
                        {
                            icon: 'check', onClick: () => {
                                this.props.commitCard();
                                this.props.history.goBack();
                            }
                        }
                    ]}
                />
                <Paper className={this.props.classes.content}>
                    <div className={this.props.classes.indexHeader}>
                        <Typography>{this.props.card.id}</Typography>
                        <Typography>{moment(this.props.card.time).format('LLL')}</Typography>
                        <Typography>{this.props.card.isClosed && 'CLOSED!'}</Typography>
                    </div>
                    <CardPageContent
                        card={this.props.card}
                        cardType={CardList.getCardType(this.props.card.typeId)}
                        selectedCardId={this.state.selectedCard ? this.state.selectedCard.id : ''}
                        onClick={(card, target) => this.setState({
                            selectedCard: card,
                            buttons: this.getButtons(card),
                            anchorEl: target
                        })}
                        handleCardClick={(card: CardRecord) => {
                            this.setState({ selectedCard: card });
                        }}
                    />
                </Paper >
                <div className={this.props.classes.footer}>
                    <CardBalance card={this.props.card} />
                    <Divider />
                    <div>{this.state.footerButtons.map(button => {
                        return (
                            <Button
                                key={`f_${button.caption}`}
                                onClick={e => {
                                    this.handleButtonClick(this.props.card, button);
                                }}>
                                {button.caption}
                            </Button>
                        );
                    })}</div>
                </div>
                <Menu
                    id="long-menu"
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleMenuClose}
                    PaperProps={{
                        style: {
                            maxHeight: 48 * 4.5,
                            width: 200,
                        },
                    }}
                >
                    {this.state.operations.map(option => (
                        <MenuItem
                            key={'cmd_' + option.type}
                            onClick={e => {
                                this.handleOperation(option, this.state.selectedCard);
                                this.handleMenuClose();
                            }}
                        >
                            {option.description}
                        </MenuItem>
                    ))}
                    {this.state.selectedCard.tags.count() > 0 && <Divider />}
                    {this.state.selectedCard.tags.valueSeq().map(tag => {
                        return (
                            <MenuItem
                                key={'edit_' + tag.name}
                                onClick={() => {
                                    this.handleOperation(
                                        this.state.operations.find(x => x.type === 'SET_CARD_TAG') as CardOperation,
                                        tag
                                    );
                                    this.handleMenuClose();
                                }}
                            >Edit {!tag.name.startsWith('_') ? tag.name : tag.value}
                            </MenuItem>
                        );
                    })}
                    {this.state.buttons.length > 0 && <Divider />}
                    {this.state.buttons.map(button => (
                        <MenuItem
                            key={'btn_' + button.caption}
                            onClick={e => {
                                this.handleButtonClick(this.state.selectedCard, button);
                                this.handleMenuClose();
                            }}
                        >
                            {button.caption}
                        </MenuItem>
                    ))}
                </Menu>
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
    Extender.extend(ClientStore.actionCreators, CardStore.actionCreators)
)(CardPage));