import * as React from 'react';
import * as moment from 'moment';
import * as shortid from 'shortid';
import { connect } from 'react-redux';
import { extend } from '../../lib/Extender';
import * as CardStore from '../../store/Cards';
import * as ClientStore from '../../store/Client';
import { IApplicationState } from '../../store/index';

import { Typography, Menu, MenuItem, Paper, Divider } from '@material-ui/core';
import decorate from './style';
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
import { CardRecord, CardTypeRecord, CardOperation, CardManager, TerminalManager, ConfigManager } from 'pmpos-core';
import { vibrate } from '../../lib/helpers';

interface IPageState {
    disableUpdate: boolean;
    anchorEl: any;
    selectedCard: CardRecord;
    buttons: CommandButton[];
    footerButtons: CommandButton[];
    selectedCategory: string;
}

export class CardPage extends React.Component<CardPageProps, IPageState> {
    constructor(props: CardPageProps) {
        super(props);
        this.state = {
            disableUpdate: false,
            anchorEl: undefined,
            selectedCard: props.card,
            buttons: [],
            footerButtons: this.getButtons(props.card, ''),
            selectedCategory: ''
        };
    }

    // private handleMenuClick = event => {
    //     this.setState({ anchorEl: event.currentTarget });
    // }

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
            // this.setState({ disableUpdate: false });
            this.props.history.goBack();
            return;
        }
        if (props.card.id && props.card !== this.props.card) {
            this.setState({
                footerButtons: this.getButtons(props.card, this.state.selectedCategory),
                selectedCard: props.card,
            });
        }
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

        const hasPendingUpdates = this.state.anchorEl && TerminalManager.getPendingActions('', this.props.card.id)
            .some(a => a.relatesToCard(this.state.selectedCard.id));

        return (
            <div className={this.props.classes.root}>
                <CardPageTopbar {...this.props}
                    commits={() => CardManager.getCommits(this.props.card.id)}
                    pendingActions={() => TerminalManager.getPendingActions('', this.props.card.id)}
                    onClose={() => {
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
                                hasPendingActions={false}
                                card={this.props.card}
                                cardType={ConfigManager.getCardTypeById(this.props.card.typeId)}
                                selectedCardId={this.state.selectedCard ? this.state.selectedCard.id : ''}
                                onClick={(card, target) => this.setState({
                                    selectedCard: card,
                                    buttons: this.getButtons(card, this.state.selectedCategory),
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

    private handleMenuClose = () => {
        this.setState({ anchorEl: undefined });
    }

    private handleCardMutation = (card: CardRecord, actionType: string, data: any) => {
        this.props.addPendingAction(card, actionType, data);
        this.handleModalClose();
    }

    private handleOperation(card: CardRecord, operation?: CardOperation, currentData?: any) {
        if (!operation) { return; }
        if (OperationEditor.hasEditor(operation.type)) {
            const component = OperationEditor.getEditor(
                operation.type,
                card,
                (at, data) => this.handleCardMutation(card, at, data),
                () => { this.handleModalClose(); },
                currentData);
            if (component) {
                this.props.SetModalComponent(component);
            }
        } else {
            const data = currentData || {};
            data.id = shortid.generate();
            data.time = new Date().getTime();
            this.handleCardMutation(card, operation.type, data);
        }
    }

    private handleButtonClick(card: CardRecord, button: CommandButton) {
        vibrate(10);
        if (button.command === '$SwitchCategory') {
            const category = button.caption.startsWith('<') ? '' : button.caption;
            this.setState({
                selectedCategory: category,
                footerButtons: this.getButtons(this.props.card, category),
            });
            return;
        }
        this.handleCardMutation(card, 'EXECUTE_COMMAND', {
            name: button.command,
            params: button.parameters
        });
    }


    private getButtonsForCommand(command: string, selectedCategory: string): CommandButton[] {
        if (!command.includes('=')) {
            const parts = command.split(':');
            let cardTypeName = parts[1];
            let groupByName = '';
            if (cardTypeName.includes(',')) {
                const p = cardTypeName.split(',');
                cardTypeName = p[0];
                groupByName = p[1];
            }
            const ct = ConfigManager.getCardTypes().find(c => c.name === cardTypeName);
            if (ct) {
                const result: CommandButton[] = [];
                const sourceCards = CardManager.getCardsByType(ct.id);
                let productCategories = ['<' + selectedCategory];
                if (!selectedCategory) {
                    productCategories = sourceCards.reduce((r, card) => {
                        const categoryName = card.getTag(groupByName, '') as string;
                        if (categoryName && r.indexOf(categoryName) === -1) {
                            r.push(categoryName);
                        }
                        return r;
                    }, Array<string>());
                }
                const categoryButtons = productCategories.map(c => new CommandButton(c + '=$SwitchCategory', 'secondary'));
                result.push(...categoryButtons);
                const productButtons = sourceCards
                    .filter(card => !groupByName || card.getTag(groupByName, '') === selectedCategory || card.getTag(groupByName, '') === '')
                    .sortBy(x => x.index).map(c =>
                        new CommandButton(`${c.name}=${parts[0]}:${
                            c.tags.reduce((r, t) => r + (r ? ',' : '') + `${t.name}=${t.value}`, '')
                            }`)).toArray();
                result.push(...productButtons);
                return result;
            }
        }
        if (!selectedCategory) { return [new CommandButton(command)]; }
        return [];
    }

    private reduceButtons(ct: CardTypeRecord, selectedCategory: string) {
        return ct.commands.filter(c => c).reduce(
            (r, c) => r.concat(this.getButtonsForCommand(c, selectedCategory)),
            new Array<CommandButton>());
    }

    private getButtons(card: CardRecord, selectedCategory: string): CommandButton[] {
        const ct = ConfigManager.getCardTypes().get(card.typeId);
        return ct
            ? this.reduceButtons(ct, selectedCategory)
            : [];
    }

    private getSelectedCard(card: CardRecord): CardRecord {
        return card !== this.state.selectedCard ? card : this.props.card;
    }

    private handleModalClose = () => {
        this.props.SetModalState(false);
    }
}

const mapStateToProps = (state: IApplicationState) => ({
    card: state.cards.currentCard,
    closeCardRequested: state.cards.closeCardRequested,
    failed: state.cards.failed
});

export default decorate(connect(
    mapStateToProps,
    extend(CardStore.actionCreators, ClientStore.actionCreators)
)(CardPage));