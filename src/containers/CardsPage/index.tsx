import * as React from 'react';
import { connect } from 'react-redux';
import * as CardStore from '../../store/Cards';
import { RouteComponentProps } from 'react-router';
import { WithStyles, List, ListItem, ListItemSecondaryAction, Paper } from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import { Map as IMap, List as IList } from 'immutable';
import TopBar from '../TopBar';
import { CardRecord } from '../../models/Card';
import ListItemText from 'material-ui/List/ListItemText';
import { CardTypeRecord } from '../../models/CardType';
import TextField from 'material-ui/TextField/TextField';
import * as faker from 'faker';

type PageProps =
    {
        cards: IList<CardRecord>,
        card: CardRecord,
        cardTypes: IMap<string, CardTypeRecord>,
        currentCardType: CardTypeRecord
    }
    & WithStyles<keyof Style>
    & typeof CardStore.actionCreators
    & RouteComponentProps<{}>;

interface State {
    currentCardType: CardTypeRecord;
    showClosedCards: boolean;
    searchValue: string;
}

class CardsPage extends React.Component<PageProps, State> {

    constructor(props: PageProps) {
        super(props);
        this.state = {
            currentCardType: props.currentCardType,
            showClosedCards: false,
            searchValue: ''
        };
    }

    componentWillReceiveProps(nextProps: PageProps) {
        if (nextProps.currentCardType.name !== this.state.currentCardType.name) {
            this.setState({ currentCardType: nextProps.currentCardType });
        }
    }

    createTestCards() {
        for (let index = 0; index < 500; index++) {
            this.props.addCard(this.props.currentCardType);
            this.props.addPendingAction(undefined, 'SET_CARD_TAG', {
                name: 'Name', value: faker.name.findName()
            });
            this.props.addPendingAction(undefined, 'SET_CARD_TAG', {
                name: 'Address', value: faker.address.streetAddress()
            });
            this.props.addPendingAction(undefined, 'SET_CARD_TAG', {
                name: 'Phone', value: faker.phone.phoneNumber()
            });
            this.props.commitCard();
        }
    }

    getSecondaryCommands() {
        let result = [
            {
                icon: 'arrow_drop_down',
                menuItems: this.props.cardTypes.valueSeq().map(ct => {
                    return {
                        icon: ct.name, onClick: () => {
                            let item = this.props.cardTypes.valueSeq().find(c => c.name === ct.name);
                            if (item) { this.setState({ currentCardType: item }); }
                            this.props.setCurrentCardType(item);
                        }
                    };
                }).toArray()
            },
            {
                icon: 'developer_mode',
                menuItems: [
                    {
                        icon: 'Show Hidden Cards',
                        onClick: () => {
                            this.setState({ showClosedCards: !this.state.showClosedCards });
                        }
                    },
                    {
                        icon: 'Create Test Cards',
                        onClick: () => {
                            this.createTestCards();
                        }
                    },
                    {
                        icon: 'Delete Cards',
                        onClick: () => {
                            this.props.deleteCards(this.props.currentCardType.id);
                        }
                    }
                ]
            },
            {
                icon: 'add',
                onClick: () => {
                    if (this.props.currentCardType.id) {
                        this.props.addCard(this.props.currentCardType);
                        this.props.history.push(process.env.PUBLIC_URL + '/card');
                    }
                }
            }
        ];
        return result;
    }

    renderCards(cards: IList<CardRecord>) {
        return cards
            .filter(x =>
                this.state.searchValue
                || this.state.showClosedCards
                || !x.isClosed)
            .filter(x => !this.state.searchValue
                || Boolean(x.tags.find(t => t.value.toLowerCase().includes(this.state.searchValue.toLowerCase()))))
            .slice(0, 100)
            .map(card => {
                return card && (
                    <ListItem
                        key={card.id}
                        button
                        divider
                        onClick={(e) => {
                            this.props.history.push(process.env.PUBLIC_URL + '/card/' + card.id);
                            e.preventDefault();
                        }}
                    >
                        <ListItemText
                            primary={card.display}
                            secondary={card.tags.valueSeq()
                                .filter(tag => tag.name !== 'Name')
                                .map(tag => (
                                    <span
                                        style={{ marginRight: '8px' }}
                                        key={tag.name}
                                    >
                                        {tag.display}
                                    </span>))}
                        />
                        <ListItemSecondaryAction style={{ right: 10, fontSize: '1.1 em' }}>
                            {card.balanceDisplay}
                        </ListItemSecondaryAction>
                    </ListItem>
                );
            });
    }

    public render() {
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title={this.state.currentCardType ? this.state.currentCardType.name : 'Cards'}
                    secondaryCommands={this.getSecondaryCommands()}
                />
                <TextField
                    className={this.props.classes.search}
                    label="Search"
                    value={this.state.searchValue}
                    onChange={e => this.setState({ searchValue: e.target.value })}
                />
                <Paper className={this.props.classes.content}>
                    <List>
                        {this.renderCards(this.props.cards)}
                    </List>
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    cards: state.cards.cards,
    card: state.cards.currentCard,
    cardTypes: state.config.cardTypes,
    currentCardType: state.cards.currentCardType
});

export default decorate(connect(
    mapStateToProps,
    CardStore.actionCreators
)(CardsPage));