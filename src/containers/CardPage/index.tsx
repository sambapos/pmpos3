import * as React from 'react';
import * as moment from 'moment';
import * as shortid from 'shortid';
import { connect } from 'react-redux';
import * as CardStore from '../../store/Cards';
import * as ClientStore from '../../store/Client';
import { ApplicationState } from '../../store/index';

import { Typography, Menu, MenuItem, Paper, Divider } from 'material-ui';
import decorate from './style';
import * as Extender from '../../lib/Extender';
import TopBar from '../TopBar';
import OperationEditor from '../../modules/OperationEditor';
import CardPageContent from './CardPageContent';
import CardBalance from './CardBalance';
import { CommandButton } from '../../components/CommandButton';
import CardPageTopbar from './CardPageTopbar';
import TagMenuItems from './TagMenuItems';
import { CardPageProps } from './CardPageProps';
import { Link } from 'react-router-dom';
import CommandButtons from '../../components/CommandButtons';
import { CardRecord, CardTypeRecord } from 'pmpos-models';
import { CardOperation, CardList, CardsManager } from 'pmpos-modules';

interface PageState {
    disableUpdate: boolean;
    anchorEl: any;
    selectedCard: CardRecord;
    buttons: CommandButton[];
    footerButtons: CommandButton[];
}

export class CardPage extends React.Component<CardPageProps, PageState> {
    constructor(props: CardPageProps) {
        super(props);
        this.state = {
            disableUpdate: false,
            anchorEl: undefined,
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

    handleOperation(card: CardRecord, operation?: CardOperation, currentData?: any) {
        if (!operation) { return; }
        if (OperationEditor.hasEditor(operation.type)) {
            let component = OperationEditor.getEditor(
                operation.type,
                card,
                (at, data) => this.handleCardMutation(card, at, data),
                () => { this.handleModalClose(); },
                currentData);
            if (component) {
                this.props.SetModalComponent(component);
            }
        } else {
            let data = currentData || {};
            data.id = shortid.generate();
            data.time = new Date().getTime();
            this.handleCardMutation(card, operation.type, data);
        }
    }

    handleButtonClick(card: CardRecord, button: CommandButton) {
        this.handleCardMutation(card, 'EXECUTE_COMMAND', {
            name: button.command,
            params: button.parameters
        });
    }

    public shouldComponentUpdate(props: CardPageProps) {
        if (this.state.disableUpdate) {
            return false;
        }
        return Boolean(props.card.id);
    }

    public componentDidMount() {
        if (this.props.match.params.id) {
            this.props.loadCard(this.props.match.params.id);
        }
    }

    public componentWillReceiveProps(props: CardPageProps) {
        if (props.closeCardRequested) {
            this.setState({ disableUpdate: false });
            this.props.history.goBack();
            return;
        }
        if (props.isLoaded && props.card !== this.props.card) {
            this.setState({
                footerButtons: this.getButtons(props.card),
                selectedCard: props.card,
            });
        }
    }

    getButtonsForCommand(command: string): CommandButton[] {
        if (!command.includes('=')) {
            let parts = command.split(':');
            let ct = CardList.getCardTypes().find(c => c.name === parts[1]);
            if (ct) {
                let cards = CardList.getCardsByType(ct.id);
                return cards.sortBy(x => x.index).map(c =>
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

    getSelectedCard(card: CardRecord): CardRecord {
        return card !== this.state.selectedCard ? card : this.props.card;
    }

    public render() {
        if (this.props.failed) {
            return (
                <div>
                    <TopBar
                        title="Can't Load Card"
                    />
                    <Link to={process.env.PUBLIC_URL + '/cards/'}>Go Back</Link>
                </div>
            );
        }

        if (!this.props.isLoaded || !this.props.card) {
            return (
                <div>
                    <TopBar
                        title="Loading...."
                    />
                </div>
            );
        }

        let hasPendingUpdates = this.state.anchorEl && CardsManager.getPendingActions('', this.props.card.id)
            .some(a => a.relatesToCard(this.state.selectedCard.id));

        return (
            <div className={this.props.classes.root}>
                <CardPageTopbar {...this.props}
                    onClose={() => {
                        // this.props.commitCard();
                        // this.props.history.goBack();
                        this.setState({ disableUpdate: true });
                        this.props.addPendingAction(this.props.card, 'COMMIT_CARD', { id: 1 });
                    }} />
                <div className={this.props.classes.container}>
                    <div className={this.props.classes.cardView}>
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
                                    this.setState({ selectedCard: this.getSelectedCard(card) });
                                }}
                            />
                        </Paper >
                        <div className={this.props.classes.footer}>
                            <CardBalance card={this.props.card} />
                            <Divider />
                        </div>
                    </div>
                    <div className={this.props.classes.commandButtons}>
                        <CommandButtons
                            handleButtonClick={(card, button) => this.handleButtonClick(card, button)}
                            card={this.props.card}
                            buttons={this.state.footerButtons}
                        />
                    </div>
                </div>
                {this.state.anchorEl && <Menu
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
                    {hasPendingUpdates && <><MenuItem
                        onClick={e => {
                            this.props.removePendingActions(this.state.selectedCard.id);
                            this.handleMenuClose();
                        }}
                    >Cancel</MenuItem>
                        <Divider /></>}
                    <TagMenuItems
                        selectedCard={this.state.selectedCard}
                        handleOperation={(op, data) =>
                            this.handleOperation(this.state.selectedCard, op, data)}
                        handleMenuClose={() => this.handleMenuClose()}
                        {...this.props} />

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
                </Menu>}
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    card: state.cards.currentCard,
    commits: state.cards.currentCommits,
    isLoaded: state.cards.isLoaded,
    closeCardRequested: state.cards.closeCardRequested,
    failed: state.cards.failed
});

export default decorate(connect(
    mapStateToProps,
    Extender.extend(ClientStore.actionCreators, CardStore.actionCreators)
)(CardPage));